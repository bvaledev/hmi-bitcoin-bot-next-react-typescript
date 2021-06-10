// require("dotenv-safe").config();
import dotenv from 'dotenv'
import { config } from './config'
dotenv.config()
import { MercadoBitcoin } from './mercado-bitcoin'
import { MercadoBitcoinTrader } from './mercado-bitcoin-trader'

export const infoApi = new MercadoBitcoin({ CURRENCY: 'BTC' })

export const tradeApi = new MercadoBitcoinTrader({
  KEY: config.KEY,
  SECRET: config.SECRET,
  PIN: config.PIN
})

export async function getQuantity(
  currency: string,
  price: number,
  isBuy: boolean
) {
  currency = isBuy ? 'brl' : currency.toLowerCase()

  const data = await tradeApi.getAccountInfo()

  const realBalance = data.balance[currency].available

  const balance = parseFloat(data.balance[currency].available).toFixed(8)
  if (!isBuy) return balance

  if (realBalance < 100) return false
  console.log(`Saldo disponível de ${currency}: ${balance}`)

  let qty = parseFloat((realBalance / price).toFixed(8))
  return qty - 0.00000001 // remove a diferença do arredondamento
}
