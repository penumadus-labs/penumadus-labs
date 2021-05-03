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

export default async ({ body }: NextApiRequest, res: NextApiResponse) => {
  await writeFile(
    join(__dirname, '..', '..', 'posts', 'ip-request-body.json'),
    JSON.stringify(body)
  )
  res.status(200).end('okay')
}
