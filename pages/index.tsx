/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/self-closing-comp */
import Head from 'next/head'
import Layouts from '@/components/Layouts'
import { getMovies } from '@/services/Blockchain.services'
import { useSelector, useDispatch } from 'react-redux'
import { selectMovies } from '@/store/selectors'
import Link from 'next/link'
import MovieCard from '@/components/MovieCard'
import { useEffect } from 'react'
import { globalActions } from '@/store/globalSlices'

export default function Home({ movies }: any) {
  const Movies = useSelector(selectMovies)
  const dispatch = useDispatch()

  const { setMovies } = globalActions

  const returnMovies = async () => {
    await getMovies()
  }

  useEffect(() => {
    dispatch(setMovies(movies))
  }, [])

  return (
    <div>
      <Head>
        <title>Dapp Cinemas || Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layouts>
        <div className="flex flex-col w-full p-4">
          <div
            style={{ backgroundImage: 'url(/assets/avengers.jpg)' }}
            className="w-full h-full rounded-3xl bg-no-repeat bg-cover bg-center mb-4 flex flex-col"
          >
            <div className="text-white p-8 space-y-8">
              <div className="space-y-2">
                <h3 className="text-3xl font-bold">AVATAR</h3>
                <p className="text-xl font-medium">THE WAY OF THE WATER</p>
              </div>
              <div>
                <button className="bg-transparent font-bold border-2 border-red-600 py-2 px-8 text-black hover:bg-gradient-to-r from-cyan-500 to-red-500  rounded-full hover:border-white hover:text-white ">
                  WATCH
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <h2 className="text-xl font-semibold p-4">Movies</h2>

            {Movies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {Movies.map((movie: any, index: number) =>
                  !movie.deleted ? (
                    <Link href={`/moviedetails/${movie.id}`} key={index}>
                      <MovieCard movie={movie} />
                    </Link>
                  ) : null
                )}
              </div>
            ) : (
              <div className="mt-10">No movies yet</div>
            )}
          </div>
        </div>
      </Layouts>
    </div>
  )
}

export const getServerSideProps = async () => {
  const movies = await getMovies()

  return {
    props: {
      movies: JSON.parse(JSON.stringify(movies)),
    },
  }
}
