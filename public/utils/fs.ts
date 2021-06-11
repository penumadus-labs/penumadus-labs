import { readFile } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

export const ipFile = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'posts',
  'ip-request.json'
)

export const readIp = async (parse = false) => {
  const buffer = await readFile(ipFile)
  return parse ? JSON.parse(buffer.toString()) : buffer
}
