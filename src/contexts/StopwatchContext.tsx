import {
  createContext,
  ReactNode,
  useEffect,
  useState
} from 'react'
import { ResponseMercadoBitcoin } from '../pages/api/mercado-bitcoin'

let StopwatchTimeout: NodeJS.Timeout

export type Form = {
  max_buy: number
  profit: string
  currency: string
  crypto: string
}

interface StopwatchContextData {
  isActive: boolean
  hasFinished: boolean
  minutes: number
  seconds: number
  percentTime: number
  dataApiMercadoBitcoin: ResponseMercadoBitcoin[]
  startStopwatch: (form: Form) => void
  resetStopwatch: () => void
}

interface StopwatchProviderProps {
  children: ReactNode
}

export const StopwatchContext = createContext({} as StopwatchContextData)

export function StopwatchProvider({ children }: StopwatchProviderProps) {
  const [formConfig, setFormConfig] = useState<Form>(null)

  const [dataApiMercadoBitcoin, setDataApiMercadoBitcoin] = useState<
    ResponseMercadoBitcoin[]
  >([])

  const [isActive, setIsActive] = useState(false)

  const [hasFinished, setHasFinished] = useState(false)

  const timeInMinutes = 0
  const [time, setTime] = useState(timeInMinutes * 60)

  let percentTime = Math.floor((time * 100) / (timeInMinutes * 60))

  const minutes = Math.floor(time / 60)
  const seconds = time % 60

  function startStopwatch(form: Form) {
    setFormConfig(form)
    setIsActive(true)
  }

  function resetStopwatch() {
    clearTimeout(StopwatchTimeout)
    setIsActive(false)
    setHasFinished(false)
    setTime(timeInMinutes * 60)
  }

  async function getData() {
    if (!formConfig) {
      return
    }

    const response = await fetch('/api/mercado-bitcoin', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formConfig)
    })

    const content = await response.json()

    if (dataApiMercadoBitcoin.length <= 0 && content?.ticker) {
      setDataApiMercadoBitcoin([...dataApiMercadoBitcoin, content])
    } else if (
      dataApiMercadoBitcoin[dataApiMercadoBitcoin.length - 1]?.ticker?.date !==
      content?.ticker?.date
    ) {
      setDataApiMercadoBitcoin([...dataApiMercadoBitcoin, content])
    }
  }

  useEffect(() => {
    if (isActive && formConfig) {
      StopwatchTimeout = setTimeout(() => {
        setTime(time + 5)
        getData()
      }, 5000)
    } else {
      setIsActive(false)
    }
  }, [isActive, time])

  return (
    <StopwatchContext.Provider
      value={{
        isActive,
        hasFinished,
        minutes,
        seconds,
        startStopwatch,
        resetStopwatch,
        percentTime,
        dataApiMercadoBitcoin
      }}
    >
      {children}
    </StopwatchContext.Provider>
  )
}
