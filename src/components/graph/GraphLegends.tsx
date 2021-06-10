import React from 'react';
import { DataSetType } from './Graph';

export type DataSetCaptions = {
  name: string,
  color: string,
  data: DataSetType,
  set: Function,
}

type Props = {
  legends: DataSetCaptions[]
}
const GraphLegends: React.FC<Props> = ({legends}:Props) => {
  return (
    <div className="flex flex-row mb-3 flex-wrap">
    {legends.map((caption, index) => {
      const isHiddenRing = caption.data.hidden ? 'ring-red-500' : 'ring-gray-300'
      const isHiddenBg = caption.data.hidden ? 'bg-red-300' : 'bg-green-100'
      return (
        <div
        key={index}
        className={`flex flex-row p-2 m-3 ring-2 ${isHiddenRing} ${isHiddenBg} hover:ring-green-400 hover:cursor-pointer rounded`}
        onClick={() => {
          caption.set({...caption.data, hidden: !caption.data.hidden})
        }}>
          <div className="w-6 h-6 rounded mr-3" style={{backgroundColor: caption.color}}></div>
          <span>
            {caption.name}
          </span>
        </div>
      )
    })}
  </div>
  );
}

export default GraphLegends;
