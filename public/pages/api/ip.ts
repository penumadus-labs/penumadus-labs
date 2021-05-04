import { NextApiRequest, NextApiResponse } from 'next'

import { writeFile } from 'fs/promises'
import { ipFile, readIp } from '../../utils/fs'

export default async (
  { method, body }: NextApiRequest,
  res: NextApiResponse
) => {
  switch (method) {
    case 'GET':
      try {
        res.status(200).end(await readIp())
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
            lastUpdated: new Date(Date.now()).toString(),
            ip: body.ip,
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
