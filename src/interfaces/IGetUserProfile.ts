export interface IGetUserProfile {
  firstName?: string | null;
  lastName?: string | null;
  userName?: string | null;
  avatarURL?: string | null;
  watchHistory?: string[] | null;
  watchLater?: string[] | null;
  likedVideos?: string[] | null;
  disLikedVideos?: string[] | null;
}