import React from 'react';

type ButtonProps = {
  actionClick: React.MouseEventHandler<HTMLButtonElement>;
  normalColor: string;
  hoverColor: string;
  textColor: string;
  text: string;
}
const Button: React.FC<ButtonProps> = ({ actionClick, normalColor, hoverColor, textColor, text } : ButtonProps) => {
  return <button
  type='button'
  className={`self-center text-sm tracking-wider font-mono uppercase font-bold ${normalColor} hover:${hoverColor} ${textColor} rounded px-4 py-2 focus:outline-none focus:ring-2 focus:${hoverColor} focus:border-transparent`}
  onClick={actionClick}>
    {text}
  </button>;
}

export default Button;
