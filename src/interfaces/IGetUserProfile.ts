export interface IGetUserProfile {
  watchHistory?: string[] | null;
  watchLater?: string[] | null;
  likedVideos?: string[] | null;
  disLikedVideos?: string[] | null;
}