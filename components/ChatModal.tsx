/* eslint-disable no-async-promise-executor */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/self-closing-comp */
import { FaTimes } from 'react-icons/fa'
import Identicon from 'react-identicons'
import { truncate } from '@/services/Blockchain.services'
import { getMessages, sendMessage, listenForMessage } from '../services/Chat'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { messages, chatModal } from '@/store/selectors'
import { globalActions } from '@/store/globalSlices'

const ChatModal = ({ id }: any) => {
  const { setChatModal, setMessages } = globalActions
  const [message, setMessage] = useState('')
  const Messages = useSelector(messages)
  const Chats = useSelector(chatModal)
  const dispatch = useDispatch()
  const handleClose = () => {
    dispatch(setChatModal('scale-0'))
  }

  const onSendMessage = async (e: any) => {
    e.preventDefault()
    if (!message) return

    const CometChat = await import('@cometchat-pro/chat').then((module) => module.CometChat)

    if (!CometChat) console.log('Unavailable')

    return new Promise<void>(async (resolve, reject) => {
      await sendMessage(CometChat, `guid_${id}`, message)
        .then((msg) => {
          dispatch(setMessages([...Messages, msg]))
          setMessage('')
          resolve()
        })
        .catch((err) => reject(err))
    })
  }

  const fetchMessages = async () => {
    const CometChat = await import('@cometchat-pro/chat').then((module) => module.CometChat)

    if (!CometChat) console.log('Unavailable')

    await getMessages(CometChat, `guid_${id}`).then((msgs: any) => {
      if (msgs.length > 0) {
        dispatch(setMessages(msgs))
      } else {
        console.log('empty')
      }
    })
    await listenForMessage(CometChat, `guid_${id}`).then((msg) => {
      dispatch(setMessages((prevMessages: any) => [...prevMessages, msg]))
    })
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  return (
    <div
      className={`fixed -top-4 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 transform z-50 transition-transform duration-300 ${Chats}`}
    >
      <div className="bg-slate-200 shadow-lg shadow-slate-900 rounded-xl w-11/12 md:w-3/5 h-[30rem] p-6  relative">
        <div className="flex justify-between items-center">
          <h2 className="capitalize">Join the live chat session</h2>
          <FaTimes className="cursor-pointer" onClick={handleClose} />
        </div>

        <div className="overflow-y-scroll overflow-x-hidden h-[20rem] scroll-bar mt-5 px-4 py-3">
          <div className="w-11/12">
            {Messages.length > 0 ? (
              Messages.map((msg: any, i: number) => (
                <Message message={msg.text} uid={msg.sender.uid} key={i} />
              ))
            ) : (
              <div> Leave a message </div>
            )}
          </div>
        </div>

        <form className="absolute bottom-5 left-[2%] h-[2rem] w-11/12 " onSubmit={onSendMessage}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="h-full w-full py-5 px-3 focus:outline-none focus:ring-0 rounded-md border-none bg-[rgba(0,0,0,0.7)] text-white placeholder-white"
            placeholder="Leave a message..."
          />
        </form>
      </div>
    </div>
  )
}

export default ChatModal

const Message = ({ message, uid }: any) => {
  return (
    <div className="flex items-center space-x-4 mb-1">
      <div className="flex items-center space-x-2">
        <Identicon string={uid} size={15} className="rounded-full" />
        <p className="font-bold text-sm">{truncate(uid, 4, 4, 11)}</p>
      </div>
      <p className="text-sm">{message}</p>
    </div>
  )
}
