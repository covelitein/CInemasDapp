/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/self-closing-comp */
import React from 'react'
import Image from 'next/image'

const MovieCard = ({ movie }: { movie: any }) => {
  return (
    <div className="flex justify-start flex-row space-x-8  sm:space-x-0  sm:flex-col p-3 space-y-2 shadow-lg w-auto rounded-lg border-2 border-gray-200">
      <div className="flex h-full w-auto">
        <img src={movie.imageUrl} className="rounded-lg object-cover h-64 w-full" alt='' />
      </div>
      <div className="flex flex-col">
        <h3 className="font-bold md:text-lg my-2">{movie.name}</h3>
        <div className="md:text-gray-500 font-normal md:text-base flex space-x-2">
          {movie.genre.split(',').map((genre: string, index : number) => (
            <button className="p-2 bg-cyan-600 rounded-md text-white" key={index}>
              {genre}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MovieCard
