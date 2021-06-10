import React from 'react';

export type SelectList = {
  value: any;
  title: string
}

type Props = {
  label: string;
  selected: string | number | readonly string[];
  changeAction: React.ChangeEventHandler<HTMLSelectElement>;
  list: SelectList[]
}

const Select: React.FC<Props> = ({label, selected, changeAction, list} : Props) => {
  return (
    <div className='flex flex-col mx-3'>
      <label className='text-gray-500 text-sm mb-1 tracking-wider font-mono'>{label}</label>
      <select defaultValue={selected} onChange={changeAction} className='px-4 py-2 font-mono rounded focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent'>
        {list.map((item, index) => <option key={index} value={item.value}>{item.title}</option>)}
      </select>
    </div>
  );
}

export default Select;
