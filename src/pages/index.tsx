import React, { useContext, useState } from 'react'
import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { Wallet } from './api/wallet'
import { StopwatchContext, Form } from '../contexts/StopwatchContext'
import WalletBadge from '../components/WalletBadge'
import { Stopwatch } from '../components/Stopwatch'
import Input from '../components/Input'
import Select from '../components/Select'
import Graph from '../components/graph/Graph'

type Props = {
  wallet: Wallet
}

const Home: React.FC<Props> = ({ wallet }: Props) => {
  const {isActive} = useContext(StopwatchContext)
  const [form, setForm] = useState<Form>({
    max_buy: 17000,
    profit: '1.1',
    currency: 'BRL',
    crypto: 'BTC'
  })

  return (
    <div>
      <Head>
        <title>HMI Bot</title>
      </Head>

      <header className="flex justify-center justify-items-center box-border bg-gray-800 text-white shadow-lg">
        <div className="container mx-auto p-4 flex justify-between justify-items-center">
          <h1 className="font-bold text-3xl self-center w-full shadow-lg rounded tracking-wider font-mono">
            HMI Bot
          </h1>
          <div className="self-center flex flex-col w-auto justify-end">
            <span className="text-xs mb-1 shadow-lg rounded tracking-wider font-mono">
              Minha Carteira
            </span>
            <div className="flex flex-row justify-end">
              <WalletBadge
                color="green"
                symbol="BRL"
                value={`R$${Number(wallet?.walletBRL).toFixed(2)}`}
              />
              <WalletBadge
                color="yellow"
                symbol="BTC"
                value={Number(wallet?.walletBTC).toFixed(2)}
              />
            </div>
          </div>
        </div>
      </header>

      <section className={`bg-gray-200 ${isActive ? 'hidden': ''}`}>
        <div className="p-4 container mx-auto flex flex-row justify-center justify-items-center">
          <Input
            type="text"
            label="Compra Máxima"
            placeholder="Compra Máxima"
            value={form.max_buy}
            actionChange={e =>
              setForm({ ...form, max_buy: Number(e.target.value) })
            }
          />

          <Input
            type="text"
            label={`Lucro (${(Number(form.profit) * 100 - 100).toFixed()}%)`}
            placeholder="Lucro"
            value={form.profit}
            actionChange={e => setForm({ ...form, profit: e.target.value })}
          />

          <Select
            label="Moeda"
            selected={form.currency}
            changeAction={e => setForm({ ...form, currency: e.target.value })}
            list={[
              { value: 'BRL', title: 'Real Brasil' },
              { value: 'USD', title: 'Dólar Americano' }
            ]}
          />

          <Select
            label="Cripto Moeda"
            selected={form.crypto}
            changeAction={e => setForm({ ...form, crypto: e.target.value })}
            list={[
              { value: 'BTC', title: 'Bitcoin' },
              { value: 'BCH', title: 'Bitcoin Cash' },
              { value: 'ETH', title: 'Ethereum' },
              { value: 'LTC', title: 'Litecoin' },
              { value: 'PAXG', title: 'PAX Gold' },
              { value: 'USDC', title: 'USD Coin' },
              { value: 'XRP', title: 'XRP' }
            ]}
          />
        </div>
      </section>

      <main className="bg-gray-50">
        <Stopwatch form={form} />

        <div className="p-4 container mx-auto flex flex-row justify-center justify-items-center max-h-96">
          <Graph/>
        </div>
      </main>

    </div>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // TODO IMPLEMENT SSG
  const res = await fetch('http://localhost:3000/api/wallet')
  const data = await res.json()

  if (!data) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      wallet: data
    }
  }
}

export default Home
