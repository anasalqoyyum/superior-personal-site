---
title: 'A clear is not mastery'
summary: 'What Arcaea and CHUNITHM taught me about learning software engineering when AI can produce code ahead of my understanding.'
publishedAt: '2026-11-03'
listAfter: '2026-11-15T00:00:00+07:00'
thumbnail: '/assets/arcaea-potential-2024-2026.webp'
thumbnailAlt: 'My Arcaea Potential graph, showing uneven progress from about 12.18 to 12.706'
thumbnailSource: 'My Arcaea Potential history on Arcaea Online'
lang: EN
---

There is a particular kind of result in rhythm games that I have learned to be careful with. I reach the end of a difficult chart, the game tells me I cleared it, and the score makes it obvious how much of it I barely held together.

The clear counts. I would still be pleased with it. But I can finish a chart without reading some patterns properly or hitting them with any consistency. Getting through once does not mean I could return tomorrow and play it well.

I have spent years playing rhythm games, particularly Arcaea and CHUNITHM. One thing that experience has taught me is that the hardest chart I can survive says surprisingly little about how reliably I play everything below it. An easier chart can expose timing problems that a harder one lets me overlook because I am too busy trying to keep up.

That distinction has become harder for me to ignore in software engineering. A working application is an achievement. So is a passing test suite. Neither tells me, by itself, whether I understand the decisions that made it work or could repair it when something changes.

With AI, the distance between what I can produce and what I understand can become very large.

## Finding a useful difficulty

Repeatedly playing charts far beyond my ability can feel like serious practice. They demand more effort, so surely I must be improving.

Sometimes I am. Other times I am repeating movements that happen to get me through, with poor timing and little understanding of the pattern. If I cannot tell what went wrong beyond "that was too fast," another attempt may give me very little to work with.

On a more manageable chart, mistakes become easier to distinguish. I can recognize a pattern and still notice that my timing is inconsistent. There is enough room to make a correction.

This is how I think about skill floor and skill ceiling. My floor is the performance I can rely on across familiar patterns. My ceiling is the difficulty I can currently reach, even if the result is uneven. Raising one does not automatically take care of the other.

Pull–Run–Push gives me a useful way to balance them. Pull means returning to easier charts and asking for better accuracy. Run means spending time with charts that challenge me while remaining readable. Push means occasionally trying something beyond that range to encounter unfamiliar patterns and find out where I struggle.

I do not treat this as a schedule to obey. Sometimes I want to play a difficult chart because it is fun. A hobby does not need to justify every attempt through improvement.

But when I want to get better, that balance matters. Staying comfortable indefinitely leaves weaknesses untested. Constantly struggling can make them difficult to identify.

In software, I see a similar balance between revisiting fundamentals, applying them in real work, and exploring something unfamiliar. Debugging a familiar function, improving assertions, or choosing useful test cases can be pull work. Building a feature and investigating its failures can be run work. An unfamiliar framework or architectural problem can be a push.

The labels matter less than whether the difficulty leaves me able to learn from what happens.

## When code gets ahead of understanding

AI makes that last part complicated because it can complete work at a level I have not reached.

Consider someone learning QA Automation who asks an agent to generate a Playwright test for an authentication flow. It might produce something like this:

```ts
test('user can log in', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill('user@example.com')
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: 'Login' }).click()

  await expect(page).toHaveURL('/dashboard')
})
```

The test passes. But does the person understand why it exists?

The name says "user can log in." The assertion establishes that the browser reached `/dashboard` after those interactions. A frontend could navigate there even if the authentication request failed. Before I trust the result, I want to understand what failure the test is meant to catch and whether its assertion would catch it.

An appropriate assertion depends on the intended behavior. Evidence that the new session can access protected, account-specific data would tell me more about successful authentication than the URL alone. Rejecting incorrect passwords, refusing unauthenticated API requests, and handling expired sessions are other behaviors that need their own coverage. One successful login test cannot establish all of them.

Then the same test passes locally but fails intermittently in CI. Perhaps the test account exists on my machine but not in CI, or parallel tests are changing its state. Perhaps the application redirects before the session is ready. The learner needs to investigate enough to distinguish an application defect from a faulty test or its setup. Adding a longer wait might make the test green while leaving the cause unexplained.

I use AI myself. I appreciate being able to ask for an explanation, compare implementations, or get help investigating a failure. It can make fundamentals more accessible, especially when I need an example explained another way.

The learning depends on what I do with the response. I can ask why an assertion belongs there, consider what would happen if it were removed, and check whether the implementation supports the explanation. I can also accept the files, run them, and move on.

Both approaches may produce the same passing suite. They leave me with different abilities afterward.

I do not think competence requires memorizing every API or working without documentation. I mean being able to reason about the result without depending entirely on the system that generated it. If the explanation is wrong, I need some basis for noticing.

The rhythm-game comparison only goes so far. Having something carry me through a difficult chart would not develop my timing, reading, or muscle memory. Reading and questioning generated code can teach me something. But neither activity guarantees learning simply because the final result looks successful.

## The parts the graph leaves out

My Arcaea Potential history makes the timescale of improvement harder to dismiss.

<figure>
  <img src="/assets/arcaea-potential-2024-2026.webp" alt="My Arcaea Potential rising from about 12.18 to 12.706 between January 2024 and September 2026, with dips and plateaus along the way" width="1020" height="1010" loading="lazy" />
  <figcaption>My Arcaea Potential from approximately January 2024 to September 2026, rising from around 12.18 to 12.706 through declines, plateaus, gradual gains, and occasional jumps.</figcaption>
</figure>

Those two numbers make the progression look tidier than it was. Between them are periods where the rating drops, stretches where it barely moves, and gains that arrive unevenly.

Potential is an imperfect approximation of skill. It does not describe every pattern I can read or how consistently I can perform across different charts. I cannot look at a flat section and declare that I was secretly improving throughout it. Sometimes a plateau means the practice needs to change. Nor can I assign each jump to a particular method just because it happened afterward.

Still, there are useful changes that may take time to show up in the number. Recognizing a pattern more reliably, correcting a recurring weakness, or becoming more consistent can precede a new score. Weeks or months without a significant rating increase do not tell the whole story.

Programming gives me even less convenient feedback. Hours spent tracing a failure may end with a small change. Understanding why an assertion was misleading might lead to fewer tests. Revisiting a basic concept can leave no impressive artifact at all.

I can finish with a clearer understanding of a system, even when the visible output is small. The difficulty is that time spent struggling is not proof of progress either. Eventually, I need to notice that I can explain something I previously could not, or approach a similar problem with less guesswork.

## Enough depth to make sense of the next thing

This is why I am cautious about treating exposure to more technologies as an uncomplicated measure of growth.

Someone entering software engineering from another field may be learning programming, testing, and the behavior of a web application simultaneously. A framework can add another set of conventions before the reasons behind them are clear. AI can make it possible to assemble all of these pieces anyway.

That can be exciting. It can also make a failure difficult to locate because several unfamiliar ideas are involved at once.

There is value in spending enough time with a few foundations that they become dependable. Understanding how state changes makes a failed authentication test easier to investigate. Knowing what an assertion establishes makes it easier to judge the suite an agent proposes. That knowledge remains useful when the framework changes.

Sometimes an ambitious project is what gives a basic concept a reason to matter. Trying something beyond my ability can reveal a gap I would never have noticed by staying with familiar problems.

I just want to return to that gap long enough to understand it. Moving on to another generated project can otherwise leave the same uncertainty underneath a more impressive result.

Rhythm games offer unusually clear feedback. There are scores, accuracy judgments, clear results, and ratings. Even there, no single number describes everything about a player. Software engineering offers signals that are much harder to interpret. Completed projects, commits, lines of code, and passing tests record activity or outcomes. They cannot tell me whether I can recognize a missing requirement or explain why a design is appropriate.

As producing code becomes cheaper, I care more about those decisions. Progress means I can investigate a problem with a better idea of what evidence to look for. I can explain a tradeoff and recognize when an unfamiliar situation needs more care.

I still enjoy clearing a difficult chart. I do not need to diminish that achievement to admit that some of it was beyond me. The next time I play something manageable, the timing problems are still there to work on.

The distance between 12.18 and 12.706 took repeated engagement over a long, uneven stretch. AI can shorten parts of my software work considerably, and I am glad to use it. I am trying to keep track of what I understand afterward, too. Looking at that graph reminds me how much of getting better has involved returning to things I could already finish and learning to do them more reliably.
