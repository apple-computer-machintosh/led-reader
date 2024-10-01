'use client'

import Head from 'next/head';
import AudioVisualizer from '../components/AudioVisualizer';

const Home: React.FC = () => {
    return (
        <div>
            <Head>
                <title>Audio Visualizer</title>
                <meta name="description" content="Audio visualizer using Next.js and TypeScript" />
            </Head>
            <main>
                <h1>Audio Visualizer</h1>
                <AudioVisualizer />
            </main>
        </div>
    );
};

export default Home;
