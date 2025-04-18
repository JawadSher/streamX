import { auth } from '@/app/api/auth/[...nextauth]/configs'
import History from '@/components/profile-page-components/history';
import UserProfile from '@/components/profile-page-components/user-profile';
import { useSession } from 'next-auth/react';
import Image from 'next/image'
import { redirect } from 'next/navigation';
import React from 'react'

const Profile = async () => {
  const user = "John Son";
  const userName = "@johnson";

  return (
    <div className='flex flex-col w-full h-full flex-grow'>
      <UserProfile fullName={user} userName={userName} avatarURL='https://example.com' />
      <History />
      <div>Playlists</div>
      <div>Watch Later</div>
      <div>Liked Videos</div>
    </div>
  )
}

export default Profile