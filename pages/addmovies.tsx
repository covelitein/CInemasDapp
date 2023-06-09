/* eslint-disable no-async-promise-executor */
/* eslint-disable react/self-closing-comp */
import Head from 'next/head'
import { useState } from 'react'
import { toast } from 'react-toastify'
import Layouts from '@/components/Layouts'
import { getMovies, addMovie } from '@/services/Blockchain.services'
import { useRouter } from 'next/router'

export default function AddMovies() {
  const [imageUrl, setImageUrl] = useState('')
  const [name, setName] = useState('')
  const [genre, setGenre] = useState('')
  const [description, setDescription] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!imageUrl || !name || !genre || !description) return
    const params = {
      name,
      imageUrl,
      genre,
      description,
    }
    await toast.promise(
      new Promise<void>(async (resolve, reject) => {
        await addMovie(params)
          .then(async () => {
            resetForm()
            getMovies()
            router.push('/')
            resolve()
          })
          .catch((error: any) => reject(error))
      }),
      {
        pending: 'Approve transaction...',
        success: 'movie created successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const resetForm = () => {
    setName('')
    setImageUrl('')
    setGenre('')
    setDescription('')
  }

  return (
    <div className="">
      <Head>
        <title>Dapp Cinemas || AddMovies</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layouts>
        <div className="flex justify-center items-center py-12 m-auto w-full ">
          <div className="block rounded-lg justify-center items-center m-auto shadow-lg shadow-gray-400 w-3/5">
            <form className="p-6" onSubmit={handleSubmit}>
              <div className="flex items-center justify-center mb-4">
                <h2>Add Movies</h2>
              </div>
              <div className="form-group mb-6 w-full">
                <input
                  type="url"
                  className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding rounded-lg outline-none lg:w-full focus:border-red-700 border-[1px] border-[#999] focus:outline-none focus:ring-0"
                  id="exampleInput7"
                  placeholder="Image Url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
              <div className="form-group mb-6">
                <input
                  type="text"
                  className="form-control block
              w-full
               px-3
              py-1.5
              text-base
              font-normal
              text-gray-700
              bg-white bg-clip-padding
             
              rounded-lg
              outline-none
            
              lg:w-full focus:border-red-700 border-[1px] border-[#999]  focus:outline-none focus:ring-0"
                  id="exampleInput7"
                  placeholder="Movie Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group mb-6">
                <input
                  type="text"
                  className="form-control block
              w-full
              px-3
              py-1.5
              text-base
              font-normal
              text-gray-700
              bg-white bg-clip-padding
             
              rounded-lg
              outline-none
            
              lg:w-full focus:border-red-700 border-[1px] border-[#999] focus:outline-none focus:ring-0"
                  id="exampleInput8"
                  placeholder="eg: hilarious, action, comedy..."
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                />
              </div>
              <div className="form-group mb-6">
                <textarea
                  className="
              form-control block
              w-full
              h-32
              resize-none
               px-3
              py-1.5
              text-base
              font-normal
              text-gray-700
              bg-white bg-clip-padding
             
              rounded-lg
              outline-none
            
            lg:w-full focus:border-red-700 border-[1px] border-[#999] focus:outline-none focus:ring-0 "
                  id="exampleFormControlTextarea13"
                  rows={3}
                  placeholder="Movie Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="flex justify-end ">
                <button
                  type="submit"
                  className="
                w-42  
                px-6
                py-2.5
                bg-transparent
                text-black
                font-medium
                text-xs
                leading-tight
                focus:ring-0
                focus:outline-none
                uppercase
                rounded-full
                shadow-md
                border-2 border-red-700
                hover:bg-gradient-to-r 
                from-cyan-500 
                to-red-500 hover:text-white 
                hover:border-white"
                >
                  Add Movie
                </button>
              </div>
            </form>
          </div>
        </div>
      </Layouts>
    </div>
  )
}
