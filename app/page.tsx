'use client'; // クライアントコンポーネントとしてマーク

import React, { useEffect } from 'react';
import useCameraHook from '@/hooks/useCamera';

const Home = () => {
  const { videoRef, startCamera } = useCameraHook();

  useEffect(() => {
    startCamera();
  }, [startCamera]);

  const handleCapture = async () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      // ここでimageDataを処理するロジックを追加
      console.log(imageData);
    }
  };

  return (
    <div>
      <h1>LED Binary Reader</h1>
      <video ref={videoRef} onClick={handleCapture} style={{ width: '100%', height: 'auto' }} />
    </div>
  );
};

export default Home;
