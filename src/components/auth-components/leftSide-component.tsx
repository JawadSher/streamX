import { imagePaths } from "@/constants/ImagePaths";
import Image from "next/image";

function LeftSideComponent() {
  return (
    <div className="relative hidden bg-sidebar lg:flex items-center justify-center rounded-2xl">
      <Image
        src={imagePaths.streamxLogo}
        width={500}
        height={100}
        alt="streamX"
      />
    </div>
  );
}

export default LeftSideComponent;