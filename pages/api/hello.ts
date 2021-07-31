// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from 'next'

const handler = (_: NextApiRequest, res: NextApiResponse): any => {
  res.status(200).json({ name: 'John Doe' })
}

export default handler
