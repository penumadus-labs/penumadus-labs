import { NextApiRequest, NextApiResponse } from 'next'

import { writeFile } from 'fs/promises'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  writeFile('../ip-request.json', JSON.stringify(req))
  writeFile('../ip-request-body.json', JSON.stringify(req.body))
  res.status(200)
}
