import { readdirSync } from 'node:fs'
import { extname } from 'node:path'
import { fileURLToPath } from 'node:url'

export interface OpusMagnumSolution {
  slug: string
  filename: string
  src: string
  extension: string
  mimeType: string | null
  puzzleName: string
  cost: number | null
  cycles: number | null
  area: number | null
  capturedAtRaw: string | null
  capturedAtSortable: string
  capturedAtLabel: string | null
}

const assetDirectory = fileURLToPath(
  new URL('../../public/assets/opus-magnum/', import.meta.url)
)
const assetBasePath = '/assets/opus-magnum'
const filenamePattern =
  /^Opus Magnum - (?<puzzleName>.+) \((?<cost>\d+)G,\s*(?<cycles>\d+),\s*(?<area>\d+),\s*(?<capturedAt>\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2})\)(?<extension>\.[^.]+)$/i

const formatCapturedAt = (value: string) => {
  const [year, month, day, hour, minute, second] = value.split('-')
  const parsedDate = new Date(
    `${year}-${month}-${day}T${hour}:${minute}:${second}`
  )

  if (Number.isNaN(parsedDate.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(parsedDate)
}

const createSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const getMimeType = (extension: string) => {
  const normalized = extension.toLowerCase()

  if (normalized === '.webm') {
    return 'video/webm'
  }

  if (normalized === '.gif') {
    return 'image/gif'
  }

  return null
}

const parseSolutionFilename = (filename: string): OpusMagnumSolution => {
  const matched = filename.match(filenamePattern)
  const extension = extname(filename)

  if (!matched?.groups) {
    const puzzleName = filename.replace(extname(filename), '')

    return {
      slug: createSlug(puzzleName),
      filename,
      src: `${assetBasePath}/${filename}`,
      extension,
      mimeType: getMimeType(extension),
      puzzleName,
      cost: null,
      cycles: null,
      area: null,
      capturedAtRaw: null,
      capturedAtSortable: '',
      capturedAtLabel: null
    }
  }

  const {
    puzzleName,
    cost,
    cycles,
    area,
    capturedAt,
    extension: matchedExt
  } = matched.groups

  return {
    slug: `${createSlug(puzzleName)}-${capturedAt}`,
    filename,
    src: `${assetBasePath}/${filename}`,
    extension: matchedExt,
    mimeType: getMimeType(matchedExt),
    puzzleName,
    cost: Number(cost),
    cycles: Number(cycles),
    area: Number(area),
    capturedAtRaw: capturedAt,
    capturedAtSortable: capturedAt,
    capturedAtLabel: formatCapturedAt(capturedAt)
  }
}

export const opusMagnumSolutions = readdirSync(assetDirectory, {
  withFileTypes: true
})
  .filter(entry => entry.isFile())
  .map(entry => entry.name)
  .sort((a, b) => a.localeCompare(b))
  .map(parseSolutionFilename)
  .sort((a, b) => b.capturedAtSortable.localeCompare(a.capturedAtSortable))
