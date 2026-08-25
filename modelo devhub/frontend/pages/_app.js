import '../styles/globals.css'
import { useAuth } from '../utils/auth'
import setupAxiosInterceptors from '../utils/axiosInterceptor'
import Head from 'next/head';
import { useEffect } from 'react'

export default function App({ Component, pageProps }) {
  const auth = useAuth()

  useEffect(() => {
    setupAxiosInterceptors();
  }, []);

  if (!Component) {
    return null;
  }

  return (
    <div>
      <Head>
        <title>Plataforma</title>
        <link rel="icon" href="/img/favicon-32x32.png" type="image/png" />
      </Head>
      <Component {...pageProps} auth={auth} />
    </div>
  )
}


