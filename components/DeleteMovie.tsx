/* eslint-disable no-async-promise-executor */
/* eslint-disable react/self-closing-comp */
import { RiErrorWarningFill } from 'react-icons/ri'
import { useSelector, useDispatch } from 'react-redux'
import { deleteMovieModal, singleMovie } from '@/store/selectors'
import { deleteMovie, getMovies } from '@/services/Blockchain.services'
import { toast } from 'react-toastify'
import { globalActions } from '@/store/globalSlices'

const DeleteMovie = () => {
  const { setDeleteMovieModal, setSingleMovie } = globalActions
  const deleteModal = useSelector(deleteMovieModal)
  const singleTempMovie = useSelector(singleMovie)
  const dispatch = useDispatch()

  const handleClose = () => {
    dispatch(setDeleteMovieModal('scale-0'))
    dispatch(setSingleMovie(null))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    await toast.promise(
      new Promise<void>(async (resolve, reject) => {
        await deleteMovie(singleTempMovie.id)
          .then(async () => {
            handleClose()
            await getMovies()
            resolve()
          })
          .catch((err) => reject(err))
      }),
      {
        pending: 'Approve transaction...',
        success: 'movie updated successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 transform z-50 transition-transform duration-300 ${deleteModal}`}
    >
      <div className="bg-white shadow-lg shadow-slate-900 rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold">Delete Movie</p>
          </div>
          <div className="flex flex-col justify-center items-center rounded-xl mt-5 mb-5">
            <div className="flex justify-center items-center rounded-full overflow-hidden h-10 w-40 shadow-md shadow-slate-300 p-4 mb-4">
              <p className="text-slate-700">
                {' '}
                Dapp <span className="text-red-700">Cinemas</span>
              </p>
            </div>
            <RiErrorWarningFill className="text-6xl text-red-700 " />
            <p className="p-2">Are you sure you want to delete this question</p>
          </div>

          <div className="flex space-x-4 justify-between">
            <div
              className=" py-2 px-4 bg-cyan-500 text-white rounded-sm cursor-pointer"
              onClick={handleClose}
            >
              Cancel
            </div>
            <button className="py-2 px-4 bg-red-500 text-white rounded-sm cursor-pointer">
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DeleteMovie