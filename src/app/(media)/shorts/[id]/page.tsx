
"use client"

export const revalidate = 60;
const Shorts = ({params}: {params: {id: string}}) => {
    const { id } = params;

    return (
        <div className="w-full h-[calc(100vh-95px)] mt-5 flex items-center justify-center overflow-hidden">
          <video
            className="w-full max-w-[540px] mx-auto aspect-[9/16] object-cover"
            // src={video.url}
            autoPlay
            loop
            muted
          />
        </div>
    );
}

export default Shorts;