import DislikedVideos from '@/components/profile-page-components/disliked-videos';
import History from '@/components/profile-page-components/history';
import LikedVideos from '@/components/profile-page-components/liked-videos';
import Playlists from '@/components/profile-page-components/playlists';
import UserProfile from '@/components/profile-page-components/user-profile';
import WatchLater from '@/components/profile-page-components/watch-later';
import React from 'react'

const Profile = async () => {
  const user = "John Son";
  const userName = "@johnson";

  return (
    <div className='flex flex-col w-full h-full flex-grow gap-3'>
      <UserProfile fullName={user} userName={userName} avatarURL='https://example.com' />
      <History />
      <Playlists />
      <WatchLater />
      <LikedVideos />
      <DislikedVideos />
    </div>
  )
}

export default Profile