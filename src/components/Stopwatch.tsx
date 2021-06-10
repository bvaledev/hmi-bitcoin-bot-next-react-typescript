import { useContext } from "react";
import { StopwatchContext, Form } from "../contexts/StopwatchContext";
import Button from './Button'

type Props = {
  form: Form;
}

export function Stopwatch({form}: Props) {
    const {
        minutes,
        seconds,
        isActive,
        startStopwatch,
        resetStopwatch,
    } = useContext(StopwatchContext)

    const [minuteLeft, minuteRight] = String(minutes).padStart(2, '0').split('');
    const [secondLeft, secondRight] = String(seconds).padStart(2, '0').split('');

    const profitWarning =  (Number(form.profit) * 100 - 100).toFixed() <= '10';

    return (
        <div className='bg-gray-700 text-white flex flex-row justify-center justify-items-center'>
            <div className='container mx-auto p-4 flex flex-col justify-center justify-items-center text-center'>
              <div className='flex flex-row justify-center justify-items-center'>
                <div className='flex flex-row justify-center justify-items-center mr-4 text-gray-700'>
                    <div className='self-center'>
                        <span className='font-mono tracking-wider bg-gray-50 mx-1 text-xl p-1 rounded'>{minuteLeft}</span>
                        <span className='font-mono tracking-wider bg-gray-50 mx-1 text-xl p-1 rounded'>{minuteRight}</span>
                    </div>
                    <span className='self-center font-mono tracking-wider bg-gray-50 mx-1 text-xl  rounded'>:</span>
                    <div className='self-center'>
                        <span className='font-mono tracking-wider bg-gray-50 mx-1 text-xl p-1 rounded'>{secondLeft}</span>
                        <span className='font-mono tracking-wider bg-gray-50 mx-1 text-xl p-1 rounded'>{secondRight}</span>
                    </div>
                </div>
                    { isActive ? (
                        <Button normalColor='bg-red-400' hoverColor='bg-red-300' textColor='text-red-900' actionClick={ resetStopwatch } text="Abandonar Ciclo" />
                        ) : (
                        <Button normalColor='bg-green-400' hoverColor='bg-green-300' textColor='text-green-900' actionClick={() => startStopwatch(form) } text="Iniciar Ciclo" />
                      )
                    }
              </div>
              <p className='mt-2 text-xs font-mono tracking-wider'>Temporizador de requisição 1 a cada 5 segundos</p>
              {isActive && (
                <div className="flex flex-row justify-center justify-items-center mt-3">
                  <span className="rounded font-mono bg-gray-200 text-gray-800 mx-3 px-3 py-1">Compra Máxima: <b>{form.max_buy}</b></span>
                  <span className="rounded font-mono bg-gray-200 text-gray-800 mx-3 px-3 py-1">Cripto Moeda: <b>{form.crypto}</b></span>
                  <span className="rounded font-mono bg-gray-200 text-gray-800 mx-3 px-3 py-1">Moeda: <b>{form.currency}</b></span>
                  <span className="rounded font-mono bg-gray-200 text-gray-800 mx-3 px-3 py-1">Lucro: <b className={ profitWarning ? 'text-red-500' : 'text-green-700'}>{(Number(form.profit) * 100 - 100).toFixed()}%</b></span>
                </div>
              )}

              { profitWarning && (
                <p className='mt-4 py-4 text-sm font-mono tracking-wider bg-red-500 rounded'>
                  Atualmente o seu lucro é baixo, o mercado bitcoin cobra a taxa baseada no lucro.
                </p>
              )}

            </div>

        </div>
    )
}
