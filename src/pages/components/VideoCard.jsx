import { useEffect, useRef } from "react";

function VideoCard({ peer }) {
  const ref = useRef();

  useEffect(() => {
    if (peer.stream) {
      ref.current.srcObject = peer.stream;
    }

    peer.conn.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, [peer]);
  return (
    <>
      <video className="videoElement" ref={ref} autoPlay playsInline />
    </>
  );
}

export default VideoCard;
