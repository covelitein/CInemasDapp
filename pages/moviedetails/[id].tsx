/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable radix */
/* eslint-disable spaced-comment */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
/* eslint-disable react/self-closing-comp */
import Head from 'next/head'
import { useEffect, useState } from 'react'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { getMovie, movieSlots, buyTicket } from '@/services/Blockchain.services'
import ChatIcon from '@mui/icons-material/Chat'
import moment from 'moment'
import { toast } from 'react-toastify'
import { checkAuthState, getGroup } from '@/services/Chat'
import { useSelector, useDispatch } from 'react-redux'
import { selectMovie, slotsForMovie, group, currentUser, connectedAccount } from '@/store/selectors'
import { globalActions } from '@/store/globalSlices'
import ChatCommand from '@/components/ChatCommand'
import AuthChat from '@/components/AuthChat'
import ChatModal from '@/components/ChatModal'
import Layouts from '@/components/Layouts'

export default function MovieDetails({ movie, movieTimeslots, id }: any) {
  const {
    setChatModal,
    setChatCommandModal,
    setAuthChatModal,
    setGroup,
    setSlotsForMovie,
    setMovie,
    setCurrentUser,
  } = globalActions
  const [filteredSlots, setFilteredSlots] = useState([])
  const [isOnline, setIsOnline] = useState(false)

  const Movie = useSelector(selectMovie)
  const SlotsForMovie = useSelector(slotsForMovie)
  const Group = useSelector(group)
  const CurrentUser = useSelector(currentUser)
  const ConnectedAccount = useSelector(connectedAccount)

  const dispatch = useDispatch()

  const handleChat = () => {
    if (isOnline && (!Group || !Group.hasJoined)) {
      dispatch(setChatCommandModal('scale-100'))
    } else if (isOnline && Group && Group.hasJoined) {
      dispatch(setChatModal('scale-100'))
    } else {
      dispatch(setAuthChatModal('scale-100'))
    }
  }

  useEffect(() => {
    const filteredTimeSlots = SlotsForMovie?.filter((slot: any) => !slot.deleted && slot.published)
    setFilteredSlots(filteredTimeSlots)
  }, [SlotsForMovie])

  const handleBuyTicket = async (day: any, Id: any, ticketCost: any) => {
    const params = {
      movieId: id,
      day,
      id: Id,
      ticketCost,
    }
    await toast.promise(
      new Promise<void>(async (resolve, reject) => {
        await buyTicket(params)
          .then(async () => {
            movieSlots(id)
            resolve()
          })
          .catch((err) => reject(err))
      }),
      {
        pending: 'Approve transaction...',
        success: 'ticket bought successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const fetchGroup = async () => {
    const CometChat = await import('@cometchat-pro/chat').then((module) => module.CometChat)

    if (!CometChat) console.log('Unavailable')
    await getGroup(CometChat, `guid_${id}`).then((Group: any) => {
      dispatch(setGroup(Group))
    })
    await checkAuthState(CometChat).then((user) => {
      dispatch(setCurrentUser(JSON.parse(JSON.stringify(user))))
    })
  }

  useEffect(() => {
    setIsOnline(CurrentUser?.uid.toLowerCase() == ConnectedAccount)
    fetchGroup()
    dispatch(setMovie(movie))
    dispatch(setSlotsForMovie(movieTimeslots))
  }, [])

  function convertTimestampToTime(timestamp: any) {
    return moment(timestamp).format('h:mm A')
  }
  function formatDateWithDayName(timestamp: any) {
    return moment(timestamp).format('dddd, MMMM Do YYYY')
  }

  return (
    <div className="">
      <Head>
        <title>Dapp Cinemas || MovieDetails</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layouts>
        <div className="flex flex-col w-full p-4 space-y-4">
          <div className="flex w-full ">
            <img src={Movie?.imageUrl} className="w-full object-cover h-[30rem]" />
          </div>
          <div className="flex flex-col space-y-4 align-center text-center w-full">
            <div className="flex flex-col space-y-2">
              <h3 className="font-black text-2xl">{Movie?.name}</h3>
              <div className="flex space-x-2 my-2 justify-center">
                {Movie?.genre?.split(',').map((genre: any, i: number) => (
                  <button className="px-4 py-1 text-white rounded-md bg-cyan-700" key={i}>
                    {genre}
                  </button>
                ))}
              </div>
              <p className="text-gray-700 my-5 w-3/6 text-center mx-auto font-semibold">
                {Movie?.description}
              </p>
              <button
                className="border-2 border-gray-300 flex items-center space-x-3 p-1 rounded-md cursor-pointer mx-auto"
                onClick={handleChat}
              >
                <ChatIcon /> &nbsp; Chats
              </button>
            </div>
            <ChatCommand movie={movie} id={id} />
            <AuthChat />
            <ChatModal id={id} />
            {filteredSlots.length > 0
              ? filteredSlots.map((slot: any, i: number) => (
                  <div key={i}>
                    <div className="flex text-center align-center mx-auto space-x-8 my-10">
                      <p className="font-bold">
                        DATE: <span className="font-thin">{formatDateWithDayName(slot.day)}</span>
                      </p>
                      <CalendarMonthIcon className="text-gray-600" />
                    </div>
                    <div className="grid grid-cols-1  gap-4 p-2">
                      <div className="flex flex-col space-y-4 items-center justify-center  md:flex-row align-center  space-x-4  bg-gray-300 rounded-md p-2  m-auto w-full md:w-2/3">
                        <div>
                          {' '}
                          <p>{convertTimestampToTime(slot.startTime)}</p>
                        </div>
                        <div className="flex items-center">
                          <span>{slot.seatings}</span>/<span>{slot.capacity}</span>
                          <sub>spaces</sub>
                        </div>
                        <div>
                          {slot.seatings >= slot.capacity ? (
                            <button className="bg-transparent border-2 border-black text-gray-600 font-bold px-4 py-1">
                              Filled up
                            </button>
                          ) : (
                            <button
                              className="bg-black py-1 px-4 text-xs font-bold text-white border-2 border-black hover:bg-transparent  rounded-full hover:border-2 hover:border-red-600 hover:text-black "
                              onClick={() => handleBuyTicket(slot.day, slot.id, slot.ticketCost)}
                            >
                              BUY TICKET
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              : 'No slots yet'}
          </div>
        </div>
      </Layouts>
    </div>
  )
}

export const getServerSideProps = async (context: any) => {
  const { id } = context.query
  const movie = await getMovie(id)
  const movieTimeslots = await movieSlots(id)

  if (!movie || !movieTimeslots) {
    throw new Error('Failed to fetch movie data')
  }

  return {
    props: {
      movie: JSON.parse(JSON.stringify(movie)),
      movieTimeslots: JSON.parse(JSON.stringify(movieTimeslots)),
      id,
    },
  }
}
