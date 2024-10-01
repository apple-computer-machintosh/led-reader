import React, { useEffect, useRef } from 'react';

const Camera: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // 外カメラを指定
          },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (error) {
        console.error('Error accessing the camera: ', error);
      }
    };

    getMedia();

    return () => {
      // コンポーネントがアンマウントされたときにストリームを停止
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <h1>外カメラ</h1>
      <div style={{ width: '100%', height: 'auto', backgroundColor: '#381929' }}>
        <video ref={videoRef} style={{ width: '100%', height: 'auto' }} autoPlay playsInline />
      </div>
    </div>
  );
};

export default Camera;
