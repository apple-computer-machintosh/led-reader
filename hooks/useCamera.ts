// hooks/useCamera.ts
import { useRef, useEffect } from 'react';

const useCameraHook = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    console.log('カメラ起動を試みています...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log('カメラが成功裏に起動しました');
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('カメラのアクセス中にエラーが発生:', error);
      alert('カメラへのアクセスに失敗しました。設定を確認してください。');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return { videoRef, startCamera };
};

export default useCameraHook;
