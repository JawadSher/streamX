import { API_ROUTES } from "@/lib/api/ApiRoutes";

export const mediaSectionItems = [
  {
    title: "Home",
    url: `${API_ROUTES.HOME}`,
    icon: "Home",
  },
  {
    title: "Shorts",
    url: `${API_ROUTES.SHORTS}`,
    icon: "Film",
  },
  {
    title: "Community posts",
    url: `${API_ROUTES.COMMUNITY_POSTS}`,
    icon: "MessageSquare",
  },
];

export const userSectionItems = [
  {
    title: "Profile",
    url: `${API_ROUTES.PROFILE}`,
    icon: "UserRound",
  },
  {
    title: "History",
    url: `${API_ROUTES.HISTORY}`,
    icon: "History",
  },
  {
    title: "Playlists",
    url: `${API_ROUTES.PLAYLISTS}`,
    icon: "list-video",
  },
  {
    title: "Your videos",
    url: `${API_ROUTES.VIDEO_UPLOADS}`,
    icon: "Video",
  },
  {
    title: "Watch later",
    url: `${API_ROUTES.WATCH_LATER}`,
    icon: "Clock",
  },
  {
    title: "Liked videos",
    url: `${API_ROUTES.LIKEDVIDEOS}`,
    icon: "ThumbsUp",
  },
  {
    title: "Disliked videos",
    url: `${API_ROUTES.DISLIKEDVIDEOS}`,
    icon: "ThumbsDown",
  },
];