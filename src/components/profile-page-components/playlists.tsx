import React from 'react'
import Container from './container'

const Playlists = () => {
  return (
    <Container className='flex-col gap-2'>
        <h1 className="text-xl font-semibold">Playlists</h1>
        <div className='flex justify-center items-center bg-[#18181b] h-40 rounded-2xl'>
            <p className='text-3xl font-bold  w-fit p-2 rounded-2xl text-zinc-300'>Comming Soon</p>
        </div>
    </Container>
  )
}

export default Playlists