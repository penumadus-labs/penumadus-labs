import { NextApiRequest, NextApiResponse } from 'next'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const writeDir = join(
  __dirname,
  '..',
  '..',
  '..',
  'posts',
  'ip-request-body.json'
)

import { writeFile } from 'fs/promises'

const writePost = (fileName: string) =>
  join(__dirname, '..', '..', 'posts', fileName)

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await Promise.all([
    writeFile(writePost('ip-request-body.json'), req.body),
    writeFile(writePost('ip-request-query.json'), JSON.stringify(req.query)),
  ])
  res.status(200).end('okay')
}
