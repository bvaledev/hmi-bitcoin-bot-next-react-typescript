import { infoApi, getQuantity } from '../../agencies/mercado_bitcoin/factory'

import type { NextApiRequest, NextApiResponse } from 'next'

export type Wallet = {
  walletBRL: number
  walletBTC: number
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let data: Wallet = {
    walletBRL: null,
    walletBTC: null
  }

  const response = await infoApi.ticker()

  let sell = response.ticker.sell
  try {
    data.walletBRL = Number(await getQuantity('BRL', sell, true))
    data.walletBTC = Number(await getQuantity('BTC', 1, false))
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json(error)
  }
}
