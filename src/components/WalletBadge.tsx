import React from 'react';

type Props = {
  color: string,
  symbol: string,
  value: string
}
const WalletBadge: React.FC<Props> = ({color, symbol, value}:Props) => {
  return (
    <div className='flex flex-row justify-center mr-2 shadow-lg rounded tracking-wider font-mono'>
        <div className={`bg-${color}-800 text-white px-2 rounded-tl rounded-bl`}>{symbol.toUpperCase()}</div>
        <div className={`bg-${color}-300 text-${color}-900 px-2 rounded-tr rounded-br`}>{value ?? '0.00'}</div>
      </div>
  );
}

export default WalletBadge;
