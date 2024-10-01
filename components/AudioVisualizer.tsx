// components/AudioVisualizer.tsx
import React, { useEffect, useRef } from 'react';

// TypeScriptにwebkitAudioContextを認識させる
interface Window {
  webkitAudioContext: typeof AudioContext;
}

const AudioVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (!canvas || !ctx) {
            return; // canvasまたはctxがnullの場合は処理を中止
        }

        // AudioContextの型を明示的に指定
        const audioCtx = new (window.AudioContext || window.AudioContext)();
        const analyser = audioCtx.createAnalyser();

        // 音源の準備（相対パスに変更）
        const audio = new Audio('C:\Users\intern\Documents\led-reader\audio\ビープ音.m4a'); // オーディオファイルのパスを指定
        const source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);

        analyser.fftSize = 2048;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            ctx.fillStyle = 'rgb(200, 200, 200)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight: number;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i];
                ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
                ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
                x += barWidth + 1;
            }
        };

        audio.play();
        draw();

        return () => {
            audio.pause();
            audioCtx.close();
        };
    }, []);

    return (
        <canvas ref={canvasRef} width={800} height={400} />
    );
};

export default AudioVisualizer;
