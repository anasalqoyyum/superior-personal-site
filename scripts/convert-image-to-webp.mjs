import { existsSync, readdirSync, statSync } from 'node:fs'
import { extname, join, relative, resolve } from 'node:path'
import sharp from 'sharp'

const repoRoot = process.cwd()
const supportedExtensions = new Set(['.png', '.jpg', '.jpeg'])

const options = {
  input: '',
  quality: 82,
  force: false
}

const printUsage = () => {
  console.log(`Usage:
  pnpm image:webp public/assets/taste.png
  pnpm image:webp public/assets --quality 86 --force

Options:
  --quality <1-100>  WebP quality. Defaults to 82.
  --force            Overwrite existing .webp files.`)
}

const parseArgs = (args) => {
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]

    if (arg === '--quality') {
      options.quality = Number(args[index + 1] ?? options.quality)
      index += 1
      continue
    }

    if (arg === '--force') {
      options.force = true
      continue
    }

    if (!options.input) {
      options.input = resolve(arg)
    }
  }

  if (!options.input || Number.isNaN(options.quality)) {
    printUsage()
    process.exit(1)
  }

  if (options.quality < 1 || options.quality > 100) {
    throw new Error('--quality must be between 1 and 100')
  }

  return options
}

const collectImageFiles = (inputPath) => {
  const stats = statSync(inputPath, { throwIfNoEntry: false })

  if (!stats) {
    throw new Error(`Input not found: ${inputPath}`)
  }

  if (stats.isFile()) {
    const extension = extname(inputPath).toLowerCase()
    return supportedExtensions.has(extension) ? [inputPath] : []
  }

  if (!stats.isDirectory()) {
    return []
  }

  const entries = readdirSync(inputPath, { withFileTypes: true })

  return entries.flatMap(entry => {
    const fullPath = join(inputPath, entry.name)

    if (entry.isDirectory()) {
      return collectImageFiles(fullPath)
    }

    const extension = extname(entry.name).toLowerCase()
    return supportedExtensions.has(extension) ? [fullPath] : []
  })
}

const convertToWebp = async (inputPath, quality, force) => {
  const outputPath = inputPath.replace(/\.(png|jpe?g)$/i, '.webp')

  if (existsSync(outputPath) && !force) {
    console.log(`Skipping: ${relative(repoRoot, inputPath)} (.webp already exists)`)
    return
  }

  await sharp(inputPath).webp({ quality }).toFile(outputPath)
  console.log(`Converted: ${relative(repoRoot, inputPath)} -> ${relative(repoRoot, outputPath)}`)
}

const main = async () => {
  const { input, quality, force } = parseArgs(process.argv.slice(2))
  const files = collectImageFiles(input)

  if (files.length === 0) {
    console.log('No PNG/JPG files found.')
    return
  }

  for (const file of files) {
    await convertToWebp(file, quality, force)
  }
}

main().catch(error => {
  console.error(error.message)
  process.exit(1)
})
