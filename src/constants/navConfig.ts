import { API_ROUTES } from "@/lib/api/ApiRoutes";

export const cssFillProperty = "material-symbols-rounded";
export const cssUnfillProperty = "material-symbols-rounded navItems";

export const mediaSectionItems = [
  {
    title: "Home",
    url: `${API_ROUTES.HOME}`,
    icon: "home", // Material Icon name
    css: cssFillProperty,
  },
  {
    title: "Shorts",
    url: `${API_ROUTES.SHORTS}`,
    css: `${cssFillProperty}`,
    icon: "movie",
  },
  {
    title: "Community posts",
    url: `${API_ROUTES.COMMUNITY_POSTS}`,
    icon: "forum",  // Material Icon name
    css: cssFillProperty,
  },
];

export const userSectionItems = [
  {
    title: "Profile",
    url: `${API_ROUTES.PROFILE}`,
    icon: "account_circle",  // Material Icon name
    css: cssFillProperty,
  },
  {
    title: "History",
    url: `${API_ROUTES.HISTORY}`,
    icon: "history",  // Material Icon name
    css: cssFillProperty,
  },
  {
    title: "Playlists",
    url: `${API_ROUTES.PLAYLISTS}`,
    icon: "playlist_play",  // Material Icon name
    css: cssFillProperty,
  },
  {
    title: "Your videos",
    url: `${API_ROUTES.VIDEO_UPLOADS}`,
    icon: "smart_display",  // Material Icon name
    css: cssFillProperty,
  },
  {
    title: "Watch later",
    url: `${API_ROUTES.WATCH_LATER}`,
    icon: "schedule",  // Material Icon name
    css: cssFillProperty,
  },
  {
    title: "Liked videos",
    url: `${API_ROUTES.LIKEDVIDEOS}`,
    icon: "thumb_up",  // Material Icon name
    css: cssFillProperty,
  },
  {
    title: "Disliked videos",
    url: `${API_ROUTES.DISLIKEDVIDEOS}`,
    icon: "thumb_down",  // Material Icon name
    css: cssFillProperty,
  },
];
