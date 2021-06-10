// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  tradeApi,
  infoApi,
  getQuantity
} from '../../agencies/mercado_bitcoin/factory'
import { Ticker } from '../../agencies/mercado_bitcoin/types'

import initMiddleware from '../../lib/init-middleware'
import validateMiddleware from '../../lib/validate-middleware'
import { check, validationResult } from 'express-validator'

import type { NextApiRequest, NextApiResponse } from 'next'

export type ResponseMercadoBitcoin = {
  ticker: Ticker
  sell: any
  orderBuy: any
  orderSell: any
  sell_message: any
  error: any
  maxBuy: number
  profit: string
  currency: string
  crypto: string
}

async function buyOrder(
  ticker: Ticker,
  currency: string,
  criptoCurrency: string
): Promise<any> {
  const sell = Number(ticker.sell)
  const quantity = await getQuantity(currency, sell, true)
  return await tradeApi.placeBuyOrder(
    Number(quantity),
    sell,
    currency,
    criptoCurrency
  )
}

async function orderSell(
  ticker: Ticker,
  profit: string = '1.1',
  currency: string,
  criptoCurrency: string
) {
  const buyPrice = parseFloat(ticker.sell)
  const profitability = parseFloat(profit) //10% = 1.1
  const sellQty = Number(await getQuantity(criptoCurrency, 1, false))
  const data2 = await tradeApi.placeSellOrder(
    sellQty,
    buyPrice * profitability,
    currency,
    criptoCurrency
  )
  console.log('Ordem de venda inserida no livro. ', data2)
  return data2
}

function checkPrice(ticker: Ticker, maxPrice: number) {
  if (Number(ticker.sell) > maxPrice) {
    return false
  }
  return true
}

const validateBody = initMiddleware(
  validateMiddleware(
    [
      check('max_buy').isNumeric(),
      check('profit').isString(),
      check('currency').isString(),
      check('crypto').isString()
    ],
    validationResult
  )
)

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      await validateBody(req, res)
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
      }

      const { profit, max_buy, currency, crypto } = req.body

      // TODO - ADICIONAR MENSAGEM
      let data: ResponseMercadoBitcoin = {
        ticker: null,
        sell: '',
        orderBuy: '',
        orderSell: '',
        sell_message: '',
        error: '',
        maxBuy: max_buy,
        profit: profit,
        currency,
        crypto
      }

      const response = await infoApi.ticker()

      data.ticker = response.ticker
      data.sell = response.ticker.sell

      if (!checkPrice(response.ticker, data.maxBuy)) {
        data.sell_message =
          'Ainda muito alto, vamos esperar pra comprar depois.'
        return res.status(200).json(data)
      }

      try {
        data.orderBuy = await buyOrder(
          response.ticker,
          data.currency,
          data.crypto
        )

        // Ordem de compra inserida no livro
        data.orderSell = await orderSell(
          response.ticker,
          data.profit,
          data.currency,
          data.crypto
        )
        // Ordem de venda inserida no livro
        res.status(200).json(data)
      } catch (error) {
        data.error = 'Erro ao inserir ordem no livro - ' + error
        res.status(500).json(data)
      }

      break
    default:
      res.status(404).json({ message: 'Request HTTP Method Incorrect.' })
      break
  }
}
