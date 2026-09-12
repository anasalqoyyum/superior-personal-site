---
title: 'Pi Chat for FFXIV: an AI agent inside a video game'
summary: Pi RPC mode, Dalamud, and ImGui, and the plumbing that keeps a coding agent chatting without freezing the game.
publishedAt: '2026-09-12'
thumbnail: '/assets/pi-dalamud-cover.webp'
thumbnailAlt: 'The pi symbol above the words PI CHAT FOR FFXIV'
thumbnailSource: 'Project icon, composited'
lang: EN
---

Can you run an AI coding agent inside the critically acclaimed MMORPG Final Fantasy XIV?

I built a small experiment to find out. [Pi Chat for FFXIV](https://www.linkedin.com/feed/update/urn:li:activity:7502032881897254912/) adds a dedicated chat window for talking to a Pi coding agent without leaving the game. I type `/pi` in the in-game chat, a window opens, and I talk to GPT-5.6 Luna while my character stands around in Limsa.

The idea is simple: open the window, send a prompt, read the answer. It does not play the game for me or automate anything. It is, at best, a productivity tool, and at worst the most elaborate way to avoid alt-tabbing into a terminal.

Before any of the fun technical parts: Square Enix's [official guidance](https://na.finalfantasyxiv.com/lodestone/topics/detail/36c4d699763603fadd2e61482b0c5d56cb2e4547) says third-party tools are strictly prohibited. This is an experimental engineering project, not a claim that using it in FFXIV is permitted or safe. I am sharing how it works, not recommending that anyone use it in-game. I'm sorry Yoshi-P, I genuinely like your game.

Now, the interesting part. Three pieces make it work: Pi's RPC mode, Dalamud, and ImGui.

## What runs where

Nothing about FFXIV was built to host a coding agent, so I did not try to make it. The plugin stays small, and everything heavy lives outside the game.

```text
FFXIV (Windows)
  └─ Dalamud plugin        C# + ImGui, runs on the game's framework thread
       │  authenticated WebSocket on ws://127.0.0.1:32145
       ▼
  Local bridge (WSL)       Node.js + TypeScript, owns the token and the workspace
       │  JSONL over stdin/stdout
       ▼
  pi --mode rpc            the actual coding agent
```

The plugin never talks to a model provider, never chooses a workspace, and never sees an API key. The bridge owns all of that. Only one WebSocket crosses the Windows and WSL boundary, and it carries JSON.

That separation is the whole design. A plugin that runs inside `ffxiv_dx11.exe` should be disposable, because a bug there takes the game down with it.

## Pi RPC mode

Pi ships a headless mode where it speaks a line-delimited JSON protocol over stdin and stdout instead of drawing a terminal UI. The bridge starts it with a deliberately small set of capabilities:

```ts
export function buildPiArguments(sessionDirectory: string): string[] {
  return [
    '--mode',
    'rpc',
    '--no-approve',
    '--no-extensions',
    '--no-skills',
    '--no-context-files',
    '--tools',
    'read,grep,find,ls',
    '--session-dir',
    sessionDirectory
  ]
}
```

Every flag narrows what the agent can do. `--no-approve` means it never stops to ask for permission, so `--tools` has to list safe tools only. No `bash`, no `write`, no `edit`. The session directory is chosen by the bridge, never by the plugin.

The wire format is small enough to fit in one screen. Commands go in, responses and events come out.

```jsonc
// → stdin
{ "id": "8f3c…", "type": "prompt", "message": "What does this test do?" }

// ← stdout
{ "id": "8f3c…", "type": "response", "command": "prompt", "success": true }

// ← stdout, some time later
{ "type": "agent_settled" }
```

A `response` only means the prompt was accepted. It says nothing about whether the model answered. The signal that the turn is actually finished is the `agent_settled` event, so the bridge waits for that and then asks for the text:

```ts
public async getLastAssistantText(): Promise<string> {
  const response = await this.sendCommand('get_last_assistant_text', {});
  const parsed = lastAssistantTextDataSchema.safeParse(response.data);
  if (!parsed.success || parsed.data.text === null) {
    throw new PiRpcProtocolError('Pi returned no completed assistant text');
  }
  return parsed.data.text;
}
```

This is why the window shows a `Running` state and then the whole answer at once. Protocol v1 does not stream token deltas. That was a deliberate cut: streaming means rendering partial Markdown, handling aborted streams, and redrawing every frame, and none of that was needed to prove the idea.

### Framing is stricter than it looks

The protocol is JSONL, one record per line, and the only valid separator is `\n`. That sounds trivial until you remember that JSON strings can legally contain U+2028 and U+2029, which many line readers treat as newlines. Node's `readline` is one of them, which is why the bridge has its own parser:

```ts
public push(chunk: Buffer): unknown[] {
  this.buffer = Buffer.concat([this.buffer, chunk]);
  const records: unknown[] = [];

  while (true) {
    const lfIndex = this.buffer.indexOf(0x0a);
    if (lfIndex < 0) return records;

    let record = this.buffer.subarray(0, lfIndex);
    this.buffer = this.buffer.subarray(lfIndex + 1);
    if (record.at(-1) === 0x0d) record = record.subarray(0, -1);
    if (record.length === 0) continue;

    try {
      records.push(JSON.parse(record.toString('utf8')));
    } catch {
      throw new PiRpcProtocolError('Pi emitted malformed JSON');
    }
  }
}
```

It buffers bytes, splits on `0x0a` only, strips a trailing `\r`, and throws on malformed JSON instead of guessing. A model that emits a Unicode line separator inside an answer should not desync the stream. It is the kind of bug that only shows up with certain content, which is the worst kind.

## Dalamud

Dalamud is the plugin framework that XIVLauncher loads into the game. A plugin gets dependency-injected services and a small lifecycle, and in exchange it is expected to behave itself. Mine asks for five services:

```csharp
public sealed class Plugin : IDalamudPlugin
{
    private const string CommandName = "/pi";
    private const int EventsPerFrame = 64;

    [PluginService]
    internal static ICommandManager CommandManager { get; private set; } = null!;

    [PluginService]
    internal static IChatGui ChatGui { get; private set; } = null!;

    [PluginService]
    internal static IFramework Framework { get; private set; } = null!;

    [PluginService]
    internal static IPluginLog Log { get; private set; } = null!;
```

`ICommandManager` registers the chat command. `IChatGui` prints short local notices like `[Pi] Working...`. `IFramework` gives a callback once per game frame. None of those names are incidental, they map directly onto the three things the plugin does.

The command registration is four lines:

```csharp
CommandManager.AddHandler(CommandName, new CommandInfo(OnCommand)
{
    HelpMessage = "Open Pi chat or use /pi <prompt>, stop, status, or new.",
});
PluginInterface.UiBuilder.Draw += windowSystem.Draw;
Framework.Update += OnFrameworkUpdate;
```

The command handler parses and queues. It does no network work and never waits for Pi:

```csharp
private void OnCommand(string command, string arguments)
{
    var parsed = CommandParser.Parse(arguments);
    switch (parsed.Kind)
    {
        case PiCommandKind.Open:
            OpenMainUi();
            break;
        case PiCommandKind.Stop:
            StopActiveRequest();
            break;
        case PiCommandKind.Status:
            RequestStatus();
            break;
        case PiCommandKind.NewSession:
            chatWindow.RequestNewSessionConfirmation();
            break;
        case PiCommandKind.Prompt:
            OpenMainUi();
            if (parsed.Prompt is not null)
            {
                SendPrompt(parsed.Prompt);
            }
            break;
    }
}
```

The parser is intentionally dumb. Empty input opens the window, `stop`, `status`, and `new` are exact matches, and everything else is a prompt:

```csharp
if (trimmed.Length == 0) return new PiCommand(PiCommandKind.Open, null);
if (trimmed.Equals("stop", StringComparison.OrdinalIgnoreCase))
    return new PiCommand(PiCommandKind.Stop, null);
if (trimmed.Equals("status", StringComparison.OrdinalIgnoreCase))
    return new PiCommand(PiCommandKind.Status, null);
if (trimmed.Equals("new", StringComparison.OrdinalIgnoreCase))
    return new PiCommand(PiCommandKind.NewSession, null);
return new PiCommand(PiCommandKind.Prompt, trimmed);
```

### No blocking on the game thread

This is the part I care most about, because it is the difference between a plugin and a crash. FFXIV renders on a framework thread, and any plugin callback that blocks freezes the frame. Network code cannot run there.

The bridge client runs its own connection loop on a background task. Every message it receives is parsed off-thread and pushed into a `ConcurrentQueue<BridgeEvent>`. The framework update then drains a bounded number of events and applies them to the chat model on the game thread:

```csharp
private void OnFrameworkUpdate(IFramework framework)
{
    for (var count = 0;
         count < EventsPerFrame && bridgeEvents.TryDequeue(out var bridgeEvent);
         count++)
    {
        model.Apply(bridgeEvent);
        switch (bridgeEvent)
        {
            case AcceptedEvent:
                ChatGui.Print("Working...", "Pi");
                break;
            case SettledEvent:
                ChatGui.Print("Response received. Use /pi to view.", "Pi");
                break;
            case BridgeErrorEvent error:
                ChatGui.PrintError($"{error.Code}: {error.Message}", "Pi");
                break;
        }
    }
}
```

Sixty-four events per frame is a cap, not a target. It stops a burst of protocol traffic from turning into a frame spike, and the queue holds the rest for the next frame. The plugin never calls `.Wait()` or `.Result` anywhere, and disposal cancels the token and closes the socket without blocking the game.

The client also refuses to connect anywhere except loopback:

```csharp
if (endpoint.Scheme != "ws" || endpoint.Host != "127.0.0.1")
{
    throw new ArgumentException("Bridge endpoint must use ws://127.0.0.1", nameof(endpoint));
}
```

The configuration rejects a URL with a path, query, or fragment, and refuses to connect with an empty token. There is a narrow set of valid shapes and no reason to accept more.

## ImGui

Dalamud exposes ImGui through `Dalamud.Bindings.ImGui` (the official binding that replaced the `ImGuiNET` namespace in API 13), so the chat window is immediate-mode drawing rather than a retained native window. Every frame, the draw callback rebuilds the UI from current state.

```csharp
public override void Draw()
{
    DrawConnectionStatus();
    DrawModelControls();
    ImGui.Separator();
    DrawTranscript();
    ImGui.Spacing();

    if (ImGui.InputTextMultiline(
            "##PiPrompt"u8,
            ref prompt,
            65_537,
            new Vector2(-1, 86),
            ImGuiInputTextFlags.EnterReturnsTrue | ImGuiInputTextFlags.CtrlEnterForNewLine))
    {
        SubmitPrompt();
    }

    DrawActions();
    ImGui.TextUnformatted(model.StatusLine);
    DrawNewSessionModal();
}
```

The transcript is a scrollable child region that re-renders every entry, with a color per role:

```csharp
if (ImGui.BeginChild("PiTranscript"u8, new Vector2(0, -205), true))
{
    foreach (var entry in model.Transcript)
    {
        ImGui.PushStyleColor(ImGuiCol.Text, RoleColor(entry.Role));
        ImGui.TextUnformatted(RoleName(entry.Role));
        ImGui.PopStyleColor();
        ImGui.SameLine();
        ImGui.TextDisabled(entry.TimestampUtc.ToLocalTime().ToString("HH:mm"));
        ImGui.PushTextWrapPos(0);
        ImGui.TextUnformatted(entry.Text);
        ImGui.PopTextWrapPos();
        ImGui.Spacing();
    }
}
ImGui.EndChild();
```

Immediate mode is a good fit here for one reason: the UI has almost no state of its own. There is a transcript, a prompt string, a connection state, and a model selector. Redrawing that from scratch each frame is cheaper and simpler than keeping a widget tree in sync with a WebSocket that can change underneath it.

`EnterReturnsTrue` with `CtrlEnterForNewLine` gives the behavior I wanted without a separate submit handler: type, hit Enter, send. `Ctrl+Enter` inserts a newline when a prompt needs to be longer.

## The bridge in the middle

The bridge is the boring part, which is the point. It keeps one Pi child process alive, validates every message, and enforces one active request at a time.

Authentication happens during the WebSocket upgrade. The token contains 32 random bytes and is compared with SHA-256 digests through a timing-safe comparison:

```ts
const expectedHash = createHash('sha256').update(token, 'utf8').digest()
const suppliedHash = createHash('sha256').update(suppliedToken, 'utf8').digest()
return timingSafeEqual(expectedHash, suppliedHash)
```

Inbound messages are validated by a Zod schema with `.strictObject()`, so an extra field is a rejection rather than something silently ignored:

```ts
const promptSchema = z
  .strictObject({
    version: z.literal(PROTOCOL_VERSION),
    type: z.literal('prompt'),
    requestId: z.uuid(),
    text: z.string().transform(text => text.trim())
  })
  .refine(({ text }) => [...text].length >= 1 && [...text].length <= 16_000, {
    message: 'text must contain 1 to 16000 characters after trimming',
    path: ['text']
  })
```

When a prompt arrives, the bridge maps it onto exactly one Pi RPC command and acknowledges it:

```ts
await pi.prompt(message.text)
active.accepted = true
this.send(socket, {
  version: PROTOCOL_VERSION,
  type: 'accepted',
  requestId: message.requestId
})
```

The plugin appends the user message on `accepted`, not on send. That way the transcript always reflects what Pi actually received, not what the UI hoped it received.

There is one more constraint that shaped the protocol: a WebSocket frame has a 64 KiB limit enforced on both ends, but Pi responses have no length limit. Rather than fail a long answer, the bridge keeps the longest prefix that fits, cuts on a code point boundary so it never splits a character, and appends a visible marker:

```ts
const textBudget = MAX_FRAME_BYTES - Buffer.byteLength(fixed, 'utf8') + 2

if (Buffer.byteLength(JSON.stringify(text), 'utf8') <= textBudget) {
  return { message: { ...envelope, text }, truncated: false }
}

const markerSize = Buffer.byteLength(
  JSON.stringify(SETTLED_TRUNCATION_MARKER),
  'utf8'
)
return {
  message: {
    ...envelope,
    text: `${truncateWithinJsonBudget(text, textBudget - markerSize + 2)}${SETTLED_TRUNCATION_MARKER}`
  },
  truncated: true
}
```

A truncated answer beats a broken connection, and the marker means the cut is never silent.

## What broke, and what I changed

The first version I got working assumed `accepted` meant done. It does not. Pi emits `agent_settled` only after retries, compaction, and queued continuations have all finished, so the bridge tracks both states and the plugin waits for the real one.

The second problem was the frame limit. Long answers killed the socket because the plugin's receive loop rejects anything over 64 KiB. The truncation path above is the fix.

The third was `readline`. It worked until it did not, and the failure was content-dependent, which is exactly how you want a protocol bug to hide. The custom parser removed the class of bug entirely.

None of these are clever. They are just the normal cost of gluing three systems together that were never designed to meet.

## What I would build next

Streaming is the obvious addition, and the RPC protocol already emits `message_update` deltas for text and thinking. The reason it is not in v1 is that it changes the UI shape: partial Markdown, a thinking indicator, and a way to stop mid-stream. Fun to build, not needed to prove the idea.

After that, a named pipe instead of a WebSocket, so the transport stops looking like a network service at all. And eventually tool activity in the transcript, which is the part that would make it feel like a real agent rather than a chat box.

## The honest caveat

Square Enix prohibits third-party tools, and building a private local plugin does not change that. The design keeps the feature to chat UI, reads no game chat, sends nothing to game servers, and triggers no gameplay, but it is still a third-party tool running inside their client. That is the whole disclaimer, and it is not a small one.

I built it because it sounded funny in my head, and it turned out to be a good excuse to learn how Dalamud plugins, ImGui, and Pi's RPC mode actually fit together. That part was worth it.

You can see the demo and the original write-up in [my post on LinkedIn](https://www.linkedin.com/feed/update/urn:li:activity:7502032881897254912/).
