
const Shorts = ({params}: {params: {id: string}}) => {
    const { id } = params;

  return (
    <div className="w-full h-screen bg-black">
      <video
        className="w-full max-w-[540px] mx-auto aspect-[9/16] object-cover"
        // src={video.url}
        autoPlay
        loop
        muted
      />
    </div>
  )
}

export default Shorts;