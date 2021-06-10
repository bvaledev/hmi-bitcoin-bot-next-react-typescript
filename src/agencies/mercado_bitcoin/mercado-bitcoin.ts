import axios from 'axios'
import { config as settings } from './config';

type InitializeMb = {
  CURRENCY: string;
}

export class MercadoBitcoin{
  constructor(private readonly config: InitializeMb) { }

  ticker() {
    return this.call('ticker')
  }

  async call(method: string) {
    let config = {
        headers: {
            'Accept': 'application/json',
        }
    }

    try {
        const response = await axios.get(`${settings.ENDPOINT_API}${this.config.CURRENCY}/${method}`, config);
        return response.data;
    } catch (error) {
        console.error(error);
        return false;
    }
  }
}
