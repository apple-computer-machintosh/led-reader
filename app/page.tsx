'use client'

import React from 'react';
import Camera from '../components/Camera';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Next.jsで外カメラを使用する例</h1>
      <Camera />
    </div>
  );
};

export default Home;
