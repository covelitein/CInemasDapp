/* eslint-disable no-async-promise-executor */
/* eslint-disable react/self-closing-comp */
import React from 'react'
import { FaTimes } from 'react-icons/fa'
import { signUpWithCometChat, loginWithCometChat } from '@/services/Chat'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import { authChatModal, connectedAccount } from '@/store/selectors'
import { globalActions } from '@/store/globalSlices'

const AuthChat = () => {
  const { setCurrentUser, setAuthChatModal, setChatCommandModal } = globalActions

  const wallet = useSelector(connectedAccount)

  const AuthChat = useSelector(authChatModal)
  const dispatch = useDispatch()

  const handleClose = () => {
    dispatch(setAuthChatModal('scale-0'))
  }

  const handleSignUp = async () => {
    const CometChat = await import('@cometchat-pro/chat').then((module) => module.CometChat)

    if (!CometChat) console.log('Unavailable')

    if (!wallet) toast.warning('Connect wallet')
    await toast.promise(
      new Promise<void>(async (resolve, reject) => {
        await signUpWithCometChat(CometChat, wallet)
          .then((user: any) => {
            dispatch(setCurrentUser(user))
            resolve()
          })
          .catch((error) => reject(error))
      }),
      {
        pending: 'processing...',
        success: 'Account created, please login 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const handleLogin = async () => {
    const CometChat = await import('@cometchat-pro/chat').then((module) => module.CometChat)

    if (!CometChat) console.log('Unavailable')

    if (!wallet) toast.warning('Connect wallet')
    await toast.promise(
      new Promise<void>(async (resolve, reject) => {
        await loginWithCometChat(CometChat, wallet)
          .then((user) => {
            dispatch(setCurrentUser(user))
            resolve()
            handleClose()
            dispatch(setChatCommandModal('scale-100'))
          })
          .catch((err) => reject(err))
      }),
      {
        pending: 'processing...',
        success: 'login successfull 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  return (
    <div
      className={`fixed -top-4 left-0 w-screen h-screen flex items-center justify-center
      bg-black bg-opacity-50 transform z-[4000] transition-transform duration-300 ${AuthChat}`}
    >
      <div className="bg-white shadow-lg shadow-slate-900 rounded-xl w-11/12  md:w-2/5 p-6  relative">
        <div className="flex items-center justify-between">
          <h2>Auth</h2>
          <FaTimes className="cursor-pointer" onClick={handleClose} />
        </div>

        <div className="flex items-center justify-center space-x-4">
          <button
            className="p-2 bg-blue-500 rounded-md text-white focus:outline-none focus:ring-0"
            onClick={handleLogin}
          >
            Login
          </button>
          <button
            className="p-2 bg-gray-600 rounded-md text-white focus:outline-none focus:ring-0"
            onClick={handleSignUp}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthChat
