import { auth } from '@/app/api/auth/[...nextauth]/configs'
import { useSession } from 'next-auth/react';
import Image from 'next/image'
import { redirect } from 'next/navigation';
import React from 'react'

const Profile = async () => {

  return (
    <div>
      <div className='border-2 border-white h-40'>
        {/* <Image  /> */}
      </div>
      <div>History</div>
      <div>Playlists</div>
      <div>Watch Later</div>
      <div>Liked Videos</div>
    </div>
  )
}

export default Profile