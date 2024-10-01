'use client'; // クライアントコンポーネントとしてマーク

import React, { useEffect, useRef, useState } from 'react';
import useCameraHook from '@/hooks/useCamera';

const Home = () => {
  const { videoRef, startCamera } = useCameraHook();
  const previousImageData = useRef<Uint8ClampedArray | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [blinkCount, setBlinkCount] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);

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
        previousImageData.current = imageData.data; // 現在の画像データを保存
      }
    }
  };

  const detectBlink = (prevData: Uint8ClampedArray, currData: Uint8ClampedArray) => {
    const prevColor = analyzeColors(prevData);
    const currColor = analyzeColors(currData);

    // 点灯状態が変わったかをチェック
    const wasBlinking = prevColor.red > 0 || prevColor.green > 0 || prevColor.blue > 0;
    const isBlinking = currColor.red > 0 || currColor.green > 0 || currColor.blue > 0;

    return wasBlinking !== isBlinking; // 状態が変わった場合に点滅とみなす
  };

  const analyzeColors = (data: Uint8ClampedArray) => {
    const colorCounts = { red: 0, green: 0, blue: 0 };
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // 簡易的な色検出
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
      <video 
        ref={videoRef} 
        style={{ width: '100%', height: 'auto' }} 
        autoPlay 
        playsInline 
      />
      <h2>点滅回数: {blinkCount}</h2>
    </div>
  );
};

export default Home;
