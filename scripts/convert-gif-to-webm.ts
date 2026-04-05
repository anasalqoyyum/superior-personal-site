import {
  existsSync,
  mkdirSync,
  readdirSync,
  renameSync,
  statSync
} from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, extname, join, relative, resolve } from 'node:path'

type Options = {
  inputDir: string
  trashDir: string
  force: boolean
}

const repoRoot = process.cwd()
const defaultInputDir = join(repoRoot, 'public/assets/opus-magnum')
const defaultTrashDir = join(repoRoot, '.trash')

const parseArgs = (args: string[]): Options => {
  const options: Options = {
    inputDir: defaultInputDir,
    trashDir: defaultTrashDir,
    force: false
  }

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]

    if (arg === '--input-dir') {
      options.inputDir = resolve(args[index + 1] ?? defaultInputDir)
      index += 1
      continue
    }

    if (arg === '--trash-dir') {
      options.trashDir = resolve(args[index + 1] ?? defaultTrashDir)
      index += 1
      continue
    }

    if (arg === '--force') {
      options.force = true
    }
  }

  return options
}

const collectGifFiles = (directory: string): string[] => {
  const entries = readdirSync(directory, { withFileTypes: true })

  return entries.flatMap(entry => {
    const fullPath = join(directory, entry.name)

    if (entry.isDirectory()) {
      return collectGifFiles(fullPath)
    }

    return extname(entry.name).toLowerCase() === '.gif' ? [fullPath] : []
  })
}

const ensureDirectory = (path: string) => {
  mkdirSync(path, { recursive: true })
}

const buildTrashPath = (filePath: string, trashDir: string) => {
  const relativePath = relative(repoRoot, filePath)

  return join(trashDir, relativePath)
}

const convertGifToWebm = (
  inputPath: string,
  outputPath: string,
  force: boolean
) => {
  const ffmpegArgs = [
    force ? '-y' : '-n',
    '-i',
    inputPath,
    '-c:v',
    'libvpx-vp9',
    '-b:v',
    '0',
    '-crf',
    '34',
    '-an',
    '-pix_fmt',
    'yuva420p',
    outputPath
  ]

  const process = spawnSync('ffmpeg', ffmpegArgs, {
    stdio: 'inherit'
  })

  if (process.status !== 0) {
    throw new Error(`ffmpeg failed for ${inputPath}`)
  }
}

const moveToTrash = (inputPath: string, trashPath: string) => {
  ensureDirectory(dirname(trashPath))
  renameSync(inputPath, trashPath)
}

const main = () => {
  const { inputDir, trashDir, force } = parseArgs(process.argv.slice(2))

  const inputStats = statSync(inputDir, { throwIfNoEntry: false })

  if (!inputStats?.isDirectory()) {
    throw new Error(`Input directory not found: ${inputDir}`)
  }

  ensureDirectory(trashDir)

  const gifFiles = collectGifFiles(inputDir)

  if (gifFiles.length === 0) {
    console.log(`No GIF files found in ${inputDir}`)
    return
  }

  console.log(`Converting ${gifFiles.length} GIF file(s) from ${inputDir}`)

  for (const gifPath of gifFiles) {
    const outputPath = gifPath.replace(/\.gif$/i, '.webm')
    const trashPath = buildTrashPath(gifPath, trashDir)

    if (existsSync(outputPath) && !force) {
      console.log(
        `\nSkipping: ${relative(repoRoot, gifPath)} (matching WebM already exists)`
      )
      continue
    }

    console.log(`\nConverting: ${relative(repoRoot, gifPath)}`)
    convertGifToWebm(gifPath, outputPath, force)
    moveToTrash(gifPath, trashPath)
    console.log(`Moved original to: ${relative(repoRoot, trashPath)}`)
  }
}

main()
