import React from 'react'
import '../styles/globals.css'
import { AppProps } from 'next/app'
import { StopwatchProvider } from '../contexts/StopwatchContext'

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return(
    <StopwatchProvider>
    <Component {...pageProps} />
    </StopwatchProvider>
    )
}
export default MyApp
