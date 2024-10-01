'use client'

import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';

const LEDRecognition: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [count, setCount] = useState<number>(0);
  const [lastFrameTime, setLastFrameTime] = useState<number>(0);

  useEffect(() => {
    const setupCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise((resolve) => {
          videoRef.current!.onloadedmetadata = () => {
            resolve(null);
          };
        });
        videoRef.current.play();
      }
    };

    setupCamera();

    const detectLED = () => {
      const context = canvasRef.current!.getContext('2d');

      const detect = () => {
        if (context && videoRef.current) {
          context.drawImage(videoRef.current, 0, 0, canvasRef.current!.width, canvasRef.current!.height);
          const imageData = context.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height);
          const data = imageData.data;

          let ledDetected = false;

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // 赤色の範囲を判定
            if (r > 150 && g < 100 && b < 100) {
              ledDetected = true;
              // LEDの位置を囲む
              const x = (i / 4) % canvasRef.current!.width;
              const y = Math.floor((i / 4) / canvasRef.current!.width);
              context.strokeStyle = 'yellow';
              context.strokeRect(x - 5, y - 5, 10, 10);
            }
          }

          // LEDの点滅をカウント
          const currentTime = Date.now();
          if (ledDetected && lastFrameTime && currentTime - lastFrameTime > 500) {
            setCount((prevCount) => prevCount + 1);
          }
          setLastFrameTime(currentTime);
        }

        requestAnimationFrame(detect);
      };

      detect();
    };

    if (videoRef.current) {
      videoRef.current.addEventListener('loadeddata', detectLED);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadeddata', detectLED);
      }
    };
  }, [lastFrameTime]);

  return (
    <div>
      <h1>LED Recognition</h1>
      <video ref={videoRef} width={640} height={480} style={{ display: 'none' }} />
      <canvas ref={canvasRef} width={640} height={480} />
      <div>
        <h2>LED点滅回数: {count}</h2>
      </div>
    </div>
  );
};

export default LEDRecognition;
