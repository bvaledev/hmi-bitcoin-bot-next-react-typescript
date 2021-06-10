import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Ticker } from '../../agencies/mercado_bitcoin/types';
import { StopwatchContext } from '../../contexts/StopwatchContext';
import GraphLegends, { DataSetCaptions } from './GraphLegends';

export type DataSetType = {
  label: string;
  hidden: boolean;
  data: any[];
  fill: boolean;
  backgroundColor: string;
  borderColor: string;
  tension: number;
}

const Graph: React.FC = () => {
  const { dataApiMercadoBitcoin, isActive } = useContext(StopwatchContext)

  function getTime(unix_timestamp: any) {
    var date = new Date(unix_timestamp * 1000)
    var hours = date.getHours()
    var minutes = '0' + date.getMinutes()
    var seconds = '0' + date.getSeconds()
    return hours + ':' + minutes.substr(-2)  + ':' + seconds.substr(-2)
  }

  const lowColors = 'rgb(185, 53, 82)'
  const [lowDataset,  setLowDataset] = useState<DataSetType>({
    label: '# Low',
    hidden: false,
    data: [],
    fill: false,
    backgroundColor: lowColors,
    borderColor: lowColors,
    tension: 0.1
  })

  const highColors = 'rgb(239, 255, 99)'
  const [highDataset, setHighDataset] = useState<DataSetType>({
    label: '# High',
    hidden: false,
    data: [],
    fill: false,
    backgroundColor: highColors,
    borderColor: highColors,
    tension: 0.1
  })

  const volColors = 'rgb(11, 28, 255)'
  const [volDataset,  setVolDataset] = useState<DataSetType>({
    label: '# Volumn',
    hidden: true,
    data: [],
    fill: false,
    backgroundColor: volColors,
    borderColor: volColors,
    tension: 0.1
  })

  const buyColors = 'rgb(255, 109, 11)'
  const [buyDataset,  setBuyDataset] = useState<DataSetType>({
    label: '# Buy',
    hidden: false,
    data: [],
    fill: false,
    backgroundColor: buyColors,
    borderColor: buyColors,
    tension: 0.1
  })

  const sellColors = 'rgb(11, 239, 255)'
  const [sellDataset, setSellDataset] = useState<DataSetType>({
    label: '# Sell',
    hidden: false,
    data: [],
    fill: false,
    backgroundColor: sellColors,
    borderColor: sellColors,
    tension: 0.1
  })

  const lastColors = 'rgb(255, 11, 202)'
  const [lastDataset, setLastDataset] = useState<DataSetType>({
    label: '# Last',
    hidden: false,
    data: [],
    fill: false,
    backgroundColor: lastColors,
    borderColor: lastColors,
    tension: 0.1
  })

  const openColors = 'rgb(39, 255, 11)'
  const [openDataset, setOpenDataset] = useState<DataSetType>({
    label: '# Open',
    hidden: false,
    data: [],
    fill: false,
    backgroundColor: openColors,
    borderColor: openColors,
    tension: 0.1
  })

  const graphCaptions: DataSetCaptions[] = [
    {
      name: 'Low',
      color: lowColors,
      data: lowDataset,
      set: setLowDataset,
    },
    {
      name: 'High',
      color: highColors,
      data: highDataset,
      set: setHighDataset,
    },
    {
      name: 'Volumn',
      color: volColors,
      data: volDataset,
      set: setVolDataset,
    },
    {
      name: 'Buy Value',
      color: buyColors,
      data: buyDataset,
      set: setBuyDataset,
    },
    {
      name: 'Sell',
      color: sellColors,
      data: sellDataset,
      set: setSellDataset,
    },
    {
      name: 'Last',
      color: lastColors,
      data: lastDataset,
      set: setLastDataset,
    },
    {
      name: 'Open',
      color: openColors,
      data: openDataset,
      set: setOpenDataset,
    },
  ]

  const [labels, setLabels] = useState<string[]>([])

  async function updateDataset(lastTicker: Ticker) {
    const tickerTime = getTime(lastTicker.date)
    const newLabels = [...labels, tickerTime]
    setLabels(newLabels)
    setLowDataset({...lowDataset,   data: [...lowDataset.data, lastTicker.low]})
    setHighDataset({...highDataset, data: [...highDataset.data, lastTicker.high]})
    setVolDataset({...volDataset,   data: [...volDataset.data, lastTicker.vol]})
    setBuyDataset({...buyDataset,   data: [...buyDataset.data, lastTicker.buy]})
    setSellDataset({...sellDataset, data: [...sellDataset.data, lastTicker.sell]})
    setLastDataset({...lastDataset, data: [...lastDataset.data, lastTicker.last]})
    setOpenDataset({...openDataset, data: [...openDataset.data, lastTicker.open]})
  }

  const options = {
    animation: {
      duration: 0 // general animation time
    },
    hover: {
      animationDuration: 0 // duration of animations when hovering an item
    },
    plugins: {
      legend: false,
    },
    responsiveAnimationDuration: 0, // animation duration after a resize
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  }

  useEffect(() => {
    const lastTicker: Ticker = dataApiMercadoBitcoin[dataApiMercadoBitcoin.length - 1]?.ticker
    if (lastTicker) {
      updateDataset(lastTicker)
    }
  }, [dataApiMercadoBitcoin])

  const datasets = [lowDataset,highDataset,volDataset,buyDataset,sellDataset,lastDataset,openDataset]

  const memoGraph = useMemo(() => <Line type="line" data={{labels, datasets}} options={options} />, datasets)

  return (
  <React.Fragment>
    <div className="flex flex-col justify-items-center items-center w-full h-screen">
      {isActive && <p className="uppercase w-full bg-gray-800 text-center text-white font-mono tracking-widest text-sm py-2 mb-4 rounded">
        {dataApiMercadoBitcoin[dataApiMercadoBitcoin.length - 1]?.sell_message || 'Aguardando ultima atualização'}
      </p>}

      <GraphLegends legends={graphCaptions}/>
      {memoGraph}
    </div>

  </React.Fragment>
  );
}

export default Graph;
