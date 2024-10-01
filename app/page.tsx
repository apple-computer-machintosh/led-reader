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

      if (imageData) {
        const colorCounts = analyzeColors(imageData.data);
        console.log('Detected Colors:', colorCounts);
      }
    }
  };

  // 色を分析する関数
  const analyzeColors = (data: Uint8ClampedArray) => {
    const colorCounts = { red: 0, green: 0, blue: 0 };
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // ここでは単純に色をカウントするだけです
      if (r > 200 && g < 100 && b < 100) {
        colorCounts.red++;
      } else if (g > 200 && r < 100 && b < 100) {
        colorCounts.green++;
      } else if (b > 200 && r < 100 && g < 100) {
        colorCounts.blue++;
      }
    }

    return colorCounts;
  };

  return (
    <div>
      <h1>LED Binary Reader</h1>
      <video ref={videoRef} onClick={handleCapture} style={{ width: '100%', height: 'auto' }} />
    </div>
  );
};

export default Home;
