'use client'; // クライアントコンポーネントとしてマーク

import React, { useEffect, useRef, useState } from 'react';
import useCameraHook from '@/hooks/useCamera';

const Home = () => {
  const { videoRef, startCamera } = useCameraHook();
  const previousImageData = useRef<Uint8ClampedArray | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [blinkCount, setBlinkCount] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [latestRGB, setLatestRGB] = useState({ r: 0, g: 0, b: 0 });

  useEffect(() => {
    startCamera();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startCamera]);

  useEffect(() => {
    intervalRef.current = setInterval(handleCapture, 100); // 100msごとにキャプチャ
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleCapture = async () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);

      if (imageData) {
        if (previousImageData.current) {
          const isCurrentlyBlinking = detectBlink(previousImageData.current, imageData.data);
          if (isCurrentlyBlinking && !isBlinking) {
            setBlinkCount(prevCount => prevCount + 1); // 点滅をカウント
          }
          setIsBlinking(isCurrentlyBlinking);
        }

        // RGB値を更新
        const rgb = getAverageColor(imageData.data);
        setLatestRGB(rgb);

        previousImageData.current = imageData.data; // 現在の画像データを保存
      }
    }
  };

  const detectBlink = (prevData: Uint8ClampedArray, currData: Uint8ClampedArray) => {
    const wasBlinking = analyzeColors(prevData) > 0;
    const isBlinking = analyzeColors(currData) > 0;

    return wasBlinking !== isBlinking; // 状態が変わった場合に点滅とみなす
  };

  const analyzeColors = (data: Uint8ClampedArray) => {
    let redCount = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // 赤色LEDの閾値を設定
      if (r > 200 && g < 100 && b < 100) {
        redCount++;
      }
    }

    return redCount; // 赤色のピクセル数を返す
  };

  const getAverageColor = (data: Uint8ClampedArray) => {
    let rTotal = 0, gTotal = 0, bTotal = 0;
    const pixelCount = data.length / 4; // ピクセル数

    for (let i = 0; i < data.length; i += 4) {
      rTotal += data[i];     // 赤
      gTotal += data[i + 1]; // 緑
      bTotal += data[i + 2]; // 青
    }

    return {
      r: Math.floor(rTotal / pixelCount),
      g: Math.floor(gTotal / pixelCount),
      b: Math.floor(bTotal / pixelCount),
    };
  };

  return (
    <div>
      <h1>LED Binary Reader</h1>
      <video 
        ref={videoRef} 
        style={{ width: '100%', height: 'auto' }} 
        autoPlay 
        playsInline 
      />
      <h2>点滅回数: {blinkCount}</h2>
      <h3>最新のRGB: R: {latestRGB.r}, G: {latestRGB.g}, B: {latestRGB.b}</h3>
    </div>
  );
};

export default Home;
