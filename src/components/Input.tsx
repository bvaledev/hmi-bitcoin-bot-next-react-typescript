import React from 'react';

type Props = {
  label: String;
  type: string;
  placeholder: string;
  value: string | number | readonly string[]
  actionChange:  React.ChangeEventHandler<HTMLInputElement>;
}

const Input: React.FC<Props> = ({label, type, placeholder, value, actionChange}: Props) => {
  return (
    <div className='flex flex-col mx-3'>
      <label className='text-gray-500 text-sm mb-1 tracking-wider font-mono'>{label}</label>
      <input type={type} value={value} onChange={actionChange} placeholder={placeholder} className='px-4 py-2 font-mono rounded focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent' />
    </div>
  );
}

export default Input;
