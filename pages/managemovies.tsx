/* eslint-disable eqeqeq */
/* eslint-disable no-async-promise-executor */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/self-closing-comp */
import Head from 'next/head'
import Layouts from '@/components/Layouts'
import { useState, useEffect } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import PublishIcon from '@mui/icons-material/Publish'
import AssignmentTurnedIn from '@mui/icons-material/AssignmentTurnedIn'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import PeopleIcon from '@mui/icons-material/People'
import { useSelector, useDispatch } from 'react-redux'
import {
  getMovies,
  movieSlots,
  publishTimeSlot,
  deleteSlot,
  withdraw,
  getTicketHolders,
  movieToTicketHolders,
  truncate,
} from '@/services/Blockchain.services'
import moment from 'moment'
import { toast } from 'react-toastify'
import { FaTimes } from 'react-icons/fa'
import Identicon from 'react-identicons'
import { globalActions } from '@/store/globalSlices'
import {
  selectMovies,
  slotsForMovie,
  movieToTicketHolderStatus,
  slotsModal,
  ticketsModal,
  ticketHolders,
  singleMovie,
} from '@/store/selectors'
import UpdateMovie from '@/components/UpdateMovie'
import DeleteMovie from '@/components/DeleteMovie'
import AddSlot from '@/components/AddSlot'

export default function ManageMovies() {
  const [loaded, setLoaded] = useState(false)
  const movies = useSelector(selectMovies)
  const SingleMovie = useSelector(singleMovie)

  const getData = async () => {
    await getMovies().then(() => setLoaded(true))
  }
  useEffect(() => {
    getData()
  }, [])

  return loaded ? (
    <div className="">
      <Head>
        <title>Dapp Cinemas || ManageMovies</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layouts>
        <div className="w-full min-h-[89vh] ">
          <h3 className="my-3 p-3 text-3xl font-bold">Manage movies</h3>
          <div className="mt-9 px-3">
            {movies.length > 0 ? (
              movies.map((movie: any, index: any) =>
                !movie.deleted ? <MovieWithDetails key={index} movie={movie} /> : null
              )
            ) : (
              <div className="text-lg">No movies found</div>
            )}
          </div>
          {SingleMovie ? (
            <>
              <UpdateMovie />
              <DeleteMovie />
              <AddSlot />
            </>
          ) : null}
        </div>
      </Layouts>
    </div>
  ) : null
}

const MovieWithDetails = ({ movie }: any) => {
  const [filteredSlots, setFilteredSlots] = useState([])
  const moviesSlots = useSelector(slotsForMovie)
  const status = useSelector(movieToTicketHolderStatus)

  const getData = async () => {
    await movieSlots(movie.id)
    await movieToTicketHolders(movie.id)
  }

  useEffect(() => {
    getData()
  }, [moviesSlots])

  useEffect(() => {
    const filteredTimeSlots = moviesSlots.filter((slot: any) => !slot.deleted)
    setFilteredSlots(filteredTimeSlots)
  }, [moviesSlots])

  const {
    setSingleMovie,
    setUpdateMovieModal,
    setDeleteMovieModal,
    setSlotsModal,
    setTicketsModal,
    setAddSlotModal,
  } = globalActions

  const dispatch = useDispatch()

  const handleOpenUpdateMovie = () => {
    dispatch(setSingleMovie(movie))
    dispatch(setUpdateMovieModal('scale-100'))
  }

  const handleOpenDeleteMovie = () => {
    dispatch(setSingleMovie(movie))
    dispatch(setDeleteMovieModal('scale-100'))
  }

  const handleOpenAddSlotMovie = () => {
    dispatch(setSingleMovie(movie))
    dispatch(setAddSlotModal('scale-100'))
  }

  const handleOpenSlots = () => {
    dispatch(setSlotsModal('scale-100'))
  }

  const handleOpenTicketsModal = () => {
    dispatch(setTicketsModal('scale-100'))
  }

  return (
    <div className="w-5/6 shadow-md rounded-lg border-2 border-gray-300 my-5">
      <div className="flex lg:flex-row flex-col">
        <div className="lg:w-1/2 p-3 w-full">
          <img src={movie.imageUrl} alt="" className="w-full rounded-lg object-cover h-64" />
        </div>
        <div className="lg:w-1/2 p-3 w-full">
          <h3 className="text-xl font-bold">{movie.name}</h3>
          <div className="flex space-x-2 my-2">
            {movie.genre.split(',').map((genre: any, i: number) => (
              <button className="px-4 py-1 text-white rounded-md bg-cyan-700" key={i}>
                {genre}
              </button>
            ))}
          </div>
          <p className="my-3">{movie.description}</p>
          <div className="flex space-x-3 my-2 flex-wrap">
            {!status ? (
              <>
                <button
                  className="border-2 border-gray-300 flex items-center space-x-3 p-1 rounded-md cursor-pointer text-sm"
                  onClick={handleOpenUpdateMovie}
                >
                  <EditIcon className="text-cyan-700" /> Update
                </button>

                <button
                  className="border-2 border-gray-300 flex items-center space-x-3 p-1 rounded-md cursor-pointer text-sm"
                  onClick={handleOpenDeleteMovie}
                >
                  <DeleteIcon className="text-red-700" /> Delete
                </button>
              </>
            ) : null}
            <button
              className="border-2 border-gray-300 flex items-center space-x-3 p-1 rounded-md cursor-pointer text-sm"
              onClick={handleOpenAddSlotMovie}
            >
              <AddIcon className="text-gray-600" /> Add slot
            </button>
          </div>

          <div className="flex space-x-3 my-2 flex-wrap">
            <button
              className="border-2 border-gray-300 flex items-center space-x-3 p-1 rounded-md cursor-pointer text-sm"
              onClick={handleOpenSlots}
            >
              <CalendarMonthIcon className="text-gray-600" /> View slot
            </button>
            <button
              className="border-2 border-gray-300 flex items-center space-x-3 p-1 rounded-md cursor-pointer text-sm"
              onClick={handleOpenTicketsModal}
            >
              <PeopleIcon className="text-gray-600" /> Ticket buyers
            </button>
          </div>
        </div>
      </div>
      <Slots filteredSlots={filteredSlots} movie={movie} />
      <TicketBuyers filteredSlots={filteredSlots} />
    </div>
  )
}

const Slots = ({ filteredSlots, movie }: any) => {
  const SlotsModal = useSelector(slotsModal)
  const { setSlotsModal } = globalActions
  const dispatch = useDispatch()

  const handleClose = () => {
    dispatch(setSlotsModal('scale-0'))
  }

  function convertTimestampToTime(timestamp: any) {
    return moment(timestamp).format('h:mm A')
  }
  function formatDateWithDayName(timestamp: any) {
    return moment(timestamp).format('dddd, MMMM Do YYYY')
  }

  const handlePublish = async (id: number, day: any) => {
    const params = {
      id,
      movieId: movie.id,
      day,
    }
    await toast.promise(
      new Promise<void>(async (resolve, reject) => {
        await publishTimeSlot(params)
          .then(async () => {
            resolve()
          })
          .catch((err) => reject(err))
      }),
      {
        pending: 'Approve transaction...',
        success: 'slot published successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }
  const handleDelete = async (id: number) => {
    const params = {
      id,
      movieId: movie.id,
    }
    await toast.promise(
      new Promise<void>(async (resolve, reject) => {
        await deleteSlot(params)
          .then(async () => {
            resolve()
          })
          .catch((err) => reject(err))
      }),
      {
        pending: 'Approve transaction...',
        success: 'slot deleted successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const handleClaim = async (id: any) => {
    const params = {
      id,
      movieId: movie.id,
    }
    await toast.promise(
      new Promise<void>(async (resolve, reject) => {
        await withdraw(params)
          .then(async () => {
            resolve()
          })
          .catch((err) => reject(err))
      }),
      {
        pending: 'Approve transaction...',
        success: 'funds claimed successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center
      bg-black bg-opacity-50 transform z-50 transition-transform duration-300 ${SlotsModal}`}
    >
      <div className="bg-white shadow-lg shadow-slate-900 rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <div className="flex flex-col overflow-y-scroll">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold">Slots</p>
            <button
              type="button"
              className="border-0 bg-transparent focus:outline-none"
              onClick={handleClose}
            >
              <FaTimes className="text-gray-400" />
            </button>
          </div>
          <div className="flex flex-col justify-center items-center rounded-xl mt-5 mb-5">
            <div className="flex justify-center items-center rounded-full overflow-hidden h-10 w-64 shadow-md shadow-slate-300 p-4">
              <p className="text-slate-700">
                {' '}
                Dapp <span className="text-red-700">Cinemas</span>
              </p>
            </div>
          </div>
          <div>
            {filteredSlots.length > 0 ? (
              <>
                {filteredSlots.map((slot: any, i: any) => (
                  <div className="my-4 px-4" key={i}>
                    <h3 className="text-gray-700">{formatDateWithDayName(slot.day)}</h3>
                    <div className="flex space-x-2 items-center">
                      <h4>{convertTimestampToTime(slot.startTime)}</h4>
                      <div className="w-3 h-[0.3px] bg-black"></div>
                      <h4>{convertTimestampToTime(slot.endTime)}</h4>
                    </div>

                    <div className="flex items-center space-x-2 my-2">
                      <button
                        className="border-2 border-gray-300 flex items-center space-x-3 p-1 rounded-md cursor-pointer text-sm"
                        onClick={() => handleDelete(slot.id)}
                      >
                        <DeleteIcon className="text-red-700 cursor-pointer" /> delete
                      </button>
                      {!slot.published ? (
                        <button
                          className="border-2 border-gray-300 flex items-center space-x-3 p-1 rounded-md cursor-pointer text-sm"
                          onClick={() => handlePublish(slot.id, slot.day)}
                        >
                          <PublishIcon className="text-cyan-600 cursor-pointer text-2xl" /> publish
                        </button>
                      ) : null}

                      {new Date().getTime() > new Date(slot.endTime).getTime() &&
                      slot.seating > 0 ? (
                        <button
                          className="border-2 border-gray-300 flex items-center space-x-3 p-1 rounded-md cursor-pointer text-sm"
                          onClick={() => handleClaim(slot.id)}
                        >
                          <AssignmentTurnedIn className="text-green-500" /> claim
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              'No slots available'
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const TicketBuyers = ({ filteredSlots }: any) => {
  const TicketsModal = useSelector(ticketsModal)
  const dispatch = useDispatch()

  const { setTicketsModal } = globalActions

  const handleClose = () => {
    dispatch(setTicketsModal('scale-0'))
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center
      bg-black bg-opacity-50 transform z-50 transition-transform duration-300 ${TicketsModal}`}
    >
      <div className="bg-white shadow-lg shadow-slate-900 rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <form className="flex flex-col overflow-y-scroll">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold">Slots</p>
            <button
              type="button"
              className="border-0 bg-transparent focus:outline-none"
              onClick={handleClose}
            >
              <FaTimes className="text-gray-400" />
            </button>
          </div>
          <div className="flex flex-col justify-center items-center rounded-xl mt-5 mb-5">
            <div className="flex justify-center items-center rounded-full overflow-hidden h-10 w-64 shadow-md shadow-slate-300 p-4">
              <p className="text-slate-700">
                {' '}
                Dapp <span className="text-red-700">Cinemas</span>
              </p>
            </div>
          </div>
          {filteredSlots.length > 0
            ? filteredSlots.map((slot: any, i: any) => (
                <TicketBuyersBySlots
                  key={i}
                  movieId={slot.movieId}
                  id={slot.id}
                  startTime={slot.startTime}
                  endTime={slot.endTime}
                  day={slot.day}
                />
              ))
            : 'No slots yet'}
        </form>
      </div>
    </div>
  )
}

const TicketBuyersBySlots = ({ movieId, id, startTime, endTime, day }: any) => {
  const TicketHolders = useSelector(ticketHolders)
  const [filteredTicketHolders, SetFilteredTicketHolders] = useState([])
  const [loaded, setLoaded] = useState(false)

  const getData = async () => {
    await getTicketHolders(movieId, id).then(() => setLoaded(true))
  }

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    const filteredBuyers = TicketHolders.filter(
      (buyer: any) => !buyer.refunded && buyer.slotId == id
    )
    SetFilteredTicketHolders(filteredBuyers)
  }, [ticketHolders])

  function convertTimestampToTime(timestamp: any) {
    return moment(timestamp).format('h:mm A')
  }
  function formatDateWithDayName(timestamp: any) {
    return moment(timestamp).format('dddd, MMMM Do YYYY')
  }

  return loaded ? (
    <div>
      {filteredTicketHolders.length > 0 ? (
        filteredTicketHolders.map((buyer: any, i: any) => (
          <div key={i}>
            <div className="my-4 px-4" key={i}>
              <h3 className="text-gray-700">{formatDateWithDayName(day)}</h3>
              <div className="flex space-x-2 items-center">
                <h4>{convertTimestampToTime(startTime)}</h4>
                <div className="w-3 h-[0.3px] bg-black"></div>
                <h4>{convertTimestampToTime(endTime)}</h4>
              </div>
            </div>
            <div className="flex space-x-3 px-3" key={i}>
              <Identicon string={buyer.owner} size={25} />
              <p>{truncate(buyer.owner, 4, 4, 11)}</p>
            </div>
          </div>
        ))
      ) : (
        <div>
          <div className="my-4 px-4">
            <h3 className="text-gray-700">{formatDateWithDayName(day)}</h3>
            <div className="flex space-x-2 items-center">
              <h4>{convertTimestampToTime(startTime)}</h4>
              <div className="w-3 h-[0.3px] bg-black"></div>
              <h4>{convertTimestampToTime(endTime)}</h4>
            </div>
          </div>
          <h3 className="px-3">No ticket buyers yet.</h3>
        </div>
      )}
    </div>
  ) : null
}
