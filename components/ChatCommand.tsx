/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-async-promise-executor */
/* eslint-disable react/self-closing-comp */
import { FaTimes } from 'react-icons/fa'
import { joinGroup, createNewGroup } from '@/services/Chat'
import { toast } from 'react-toastify'
import { useState, useEffect } from 'react'
import { getOwner } from '@/services/Blockchain.services'
import { useSelector, useDispatch } from 'react-redux'
import { chatCommandModal, connectedAccount, deployer } from '@/store/selectors'
import { globalActions } from '@/store/globalSlices'

const ChatCommand = ({ movie, id }: any) => {
  const { setChatCommandModal, setGroup, setChatModal } = globalActions
  const chatCommand = useSelector(chatCommandModal)
  const wallet = useSelector(connectedAccount)
  const [loaded, setLoaded] = useState(false)
  const owner = useSelector(deployer)
  const dispatch = useDispatch()
  let CometChat: typeof import('@cometchat-pro/chat').CometChat
  if (typeof window !== 'undefined') {
    CometChat = window.CometChat
  }
  const handleClose = () => {
    return dispatch(setChatCommandModal('scale-0'))
    // console.log('hello')
  }

  const handleCreateGroup = async () => {
    const CometChat = await import('@cometchat-pro/chat').then((module) => module.CometChat)

    if (!CometChat) console.log('Unavailable')

    await toast.promise(
      new Promise<void>(async (resolve, reject) => {
        await createNewGroup(CometChat, `guid_${id}`, movie.name)
          .then((group) => {
            dispatch(setGroup(group))
            resolve()
            handleClose()
            dispatch(setChatModal('scale-100'))
          })
          .catch((err) => reject(err))
      }),
      {
        pending: 'Creating group...',
        success: 'Group created successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const handleJoinGroup = async () => {
    const CometChat = await import('@cometchat-pro/chat').then((module) => module.CometChat)

    if (!CometChat) console.log('Unavailable')

    await toast.promise(
      new Promise<void>(async (resolve, reject) => {
        await joinGroup(CometChat, `guid_${id}`)
          .then(async (group) => {
            dispatch(setGroup(group))
            resolve()
            handleClose()
            dispatch(setChatModal('scale-100'))
          })
          .catch((err) => reject(err))
      }),
      {
        pending: 'joining group...',
        success: 'joined successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }
  const getDeployer = async () => {
    await getOwner().then(() => setLoaded(true))
  }

  useEffect(() => {
    getDeployer()
  }, [])

  return loaded ? (
    <div
      className={`fixed -top-4 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 transform z-[4000] transition-transform duration-300 ${chatCommand}`}
    >
      <div className="bg-white shadow-lg shadow-slate-900 rounded-xl w-11/12  md:w-2/5 h-[12rem] p-6  relative">
        <div className="flex items-center justify-between">
          <h2>Auth</h2>
          <FaTimes className="cursor-pointer" onClick={handleClose} />
        </div>

        <div className="mt-12 flex items-center justify-center space-x-6">
          {owner && owner?.toLowerCase() == wallet?.toLowerCase() ? (
            <button
              className="p-2 bg-cyan-700 rounded-md text-white focus:outline-none focus:ring-0"
              onClick={handleCreateGroup}
            >
              Create Group
            </button>
          ) : (
            <button
              className="p-2 bg-red-700 rounded-md text-white focus:outline-none focus:ring-0"
              onClick={handleJoinGroup}
            >
              Join group
            </button>
          )}
        </div>
      </div>
    </div>
  ) : null
}

export default ChatCommand
