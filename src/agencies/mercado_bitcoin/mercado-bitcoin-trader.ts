import crypto from 'crypto'
import axios from 'axios'
import qs from 'querystring'
import { config as settings } from './config'

type InitializeMbT = {
  KEY: string
  SECRET: string
  PIN: string
}

export class MercadoBitcoinTrader {
  constructor(private readonly config: InitializeMbT) {}

  //pega informações da sua conta, especialmente o seu saldo atual em cada moeda, incluindo BRL;
  getAccountInfo() {
    return this.call('get_account_info', {})
  }

  // criar uma nova ordem de compra no livro de negociações. Caso haja disponibilidade (tem moedas sendo vendidas ao preço que deseja pagar), a ordem será executada imediatamente. Caso contrário, ela vai pro livro e seu saldo fica bloqueado para honrar a compra;
  placeBuyOrder(
    qty: number,
    limit_price: number,
    currency: string,
    criptoCurrency: string
  ) {
    return this.call('place_buy_order', {
      coin_pair: `${currency.toUpperCase()}${criptoCurrency.toUpperCase()}`,
      quantity: `${qty}`.substr(0, 10),
      limit_price: `${limit_price}`
    })
  }

  // cria uma nova ordem de venda no livro de negociações. Caso haja disponibilidade (tem ordens de compra ao preço que você deseja vender), a ordem será executada imediatamente. Caso contrário, ela vai pro livro e seu saldo na criptomoeda fica bloqueado para honrar a venda
  placeSellOrder(
    qty: number,
    limit_price: number,
    currency: string,
    criptoCurrency: string
  ) {
    return this.call('place_sell_order', {
      coin_pair: `${currency.toUpperCase()}${criptoCurrency.toUpperCase()}`,
      quantity: `${qty}`.substr(0, 10),
      limit_price: `${limit_price}`
    })
  }

  async call(tapi_method: string, parameters: any) {
    const tapi_nonce = new Date().getTime()
    let queryString = qs.stringify({ tapi_method, tapi_nonce })
    if (parameters) queryString += `&${qs.stringify(parameters)}`

    const signature = crypto
      .createHmac('sha512', this.config.SECRET)
      .update(`${settings.ENDPOINT_TRADE_PATH}?${queryString}`)
      .digest('hex')

    const config = {
      headers: {
        'TAPI-ID': this.config.KEY,
        'TAPI-MAC': signature
      }
    }

    const response = await axios.post(
      settings.ENDPOINT_TRADE_API,
      queryString,
      config
    )
    if (response.data.error_message)
      throw new Error(response.data.error_message)
    return response.data.response_data
  }
}
