import VideoGrid from "@/components/video-grid";
import { imagePaths } from "@/lib/ImagePaths";



export const revalidate = 60;
const Home = async () => {
  const videos = imagePaths.videoThumbnail;
  const defaultThumbnail = imagePaths.videoThumbnail;

  return <VideoGrid videos={videos} defaultThumbnail={defaultThumbnail} />;
};

export default Home;
