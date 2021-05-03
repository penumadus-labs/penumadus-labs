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

export default async (
  { method, body }: NextApiRequest,
  res: NextApiResponse
) => {
  switch (method) {
    case 'GET':
      try {
        const response = await readFile(ipFile)
        res.status(200).end(response)
      } catch (e) {
        console.error(e)
        res.status(404).end('ip address not found')
      }
      return

    case 'POST':
      try {
        await writeFile(
          ipFile,
          JSON.stringify({
            time: new Date(Date.now()).toTimeString(),
            ...body,
          })
        )
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
