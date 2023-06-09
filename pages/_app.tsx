/* eslint-disable react-hooks/exhaustive-deps */
import { AppProps } from 'next/app'
import '@/styles/global.css'
import { Provider } from 'react-redux'
import { store } from '@/store'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { useEffect, useState } from 'react'
import { walletConnectedStatus } from '@/services/Blockchain.services'
import CometChatNoSSR from '@/components/CometChatNoSSR'
// import { CometChat } from '@cometchat-pro/chat'

export default function MyApp({ Component, pageProps }: AppProps) {
  const [isBrowser, setIsBrowser] = useState(false)
  let CometChat: typeof import('@cometchat-pro/chat').CometChat

  useEffect(() => {
    setIsBrowser(typeof window === 'undefined')
    if (typeof window !== 'undefined') {
      CometChat = window.CometChat
      walletConnectedStatus(CometChat)
    }
  }, [])

  // eslint-disable-next-line no-constant-binary-expression

  if (!isBrowser) {
    console.log(process.env.NEXT_APP_COMET_CHAT_APP_ID)
    return (
      <Provider store={store}>
        <CometChatNoSSR />
        <Component {...pageProps} />

        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </Provider>
    )
  } else {
    return null
  }
}
