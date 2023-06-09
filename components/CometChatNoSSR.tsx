/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { globalActions } from '@/store/globalSlices'
import { initCometChat, checkAuthState } from '@/services/Chat'
import { walletConnectedStatus } from '@/services/Blockchain.services'

declare global {
  interface Window {
    CometChat: typeof import('@cometchat-pro/chat').CometChat
  }
}

const CometChatNoSSR = (): null => {
  const dispatch = useDispatch()  
  useEffect(() => {
    const { setCurrentUser } = globalActions

    const initializeCometChat = async () => {
      const CometChat = await import('@cometchat-pro/chat').then((module) => module.CometChat)
      window.CometChat = CometChat

      initCometChat(CometChat).then(() => {
        checkAuthState(CometChat).then((user) => {
          dispatch(setCurrentUser(JSON.parse(JSON.stringify(user))))
        })
      })

      walletConnectedStatus(CometChat)
    }

    initializeCometChat()
  }, [])

  return null
}

export default CometChatNoSSR
