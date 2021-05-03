import { NextApiRequest, NextApiResponse } from 'next'

import { readFile, writeFile } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const ipFile = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'posts',
  'ip-request.json'
)

export const readIp = async () => {
  await readFile(ipFile)
  const data = await readFile(ipFile)
  const { ip }: { ip: string } = JSON.parse(data.toString())
  return ip
}

export const writeIp = (data: object) => writeFile(ipFile, JSON.stringify(data))

export default async (
  { method, body }: NextApiRequest,
  res: NextApiResponse
) => {
  switch (method) {
    case 'GET':
      try {
        const ip = await readIp()
        res.status(200).end(ip)
      } catch (e) {
        console.error(e)
        res.status(404).end('ip address not found')
      }
      return

    case 'POST':
      try {
        await writeIp(body)
        res.status(200).end('okay')
      } catch (e) {
        console.error(e)
        res.status(500).end('something went wrong: ip was not saved')
      }
      return

    default:
      res.status(400).end('bad request')
  }
}
