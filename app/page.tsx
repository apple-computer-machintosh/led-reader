'use client'

import { useEffect, useRef, useState } from 'react';

const LEDRecognition: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [count, setCount] = useState(0);
  const [lastFrameTime, setLastFrameTime] = useState(0);

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (error) {
        console.error('カメラのセットアップに失敗しました:', error);
      }
    };

    setupCamera();

    const detectLED = () => {
      const context = canvasRef.current?.getContext('2d');

      const detect = () => {
        if (context && videoRef.current) {
          context.drawImage(videoRef.current, 0, 0);
          const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
          const data = imageData.data;

          let ledDetected = false;

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i + 1], b = data[i + 2];

            // 赤色の範囲を判定
            if (r > 150 && g < 100 && b < 100) {
              ledDetected = true;
              const x = (i / 4) % canvasRef.current.width;
              const y = Math.floor((i / 4) / canvasRef.current.width);
              context.strokeStyle = 'yellow';
              context.strokeRect(x - 5, y - 5, 10, 10);
            }
          }

          const currentTime = Date.now();
          if (ledDetected && lastFrameTime && currentTime - lastFrameTime > 500) {
            setCount(prev => prev + 1);
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
