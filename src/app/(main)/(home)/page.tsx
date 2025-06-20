import VideoGrid from "@/components/video-card/video-grid";
import { imagePaths } from "@/lib/ImagePaths";

export const revalidate = 0;
const Home = async () => {
  const videos = imagePaths.videoThumbnail;
  const defaultThumbnail = imagePaths.videoThumbnail;

  return <VideoGrid videos={videos} defaultThumbnail={defaultThumbnail} />;
};

export default Home;
