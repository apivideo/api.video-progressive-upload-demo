import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import { WebcamRecorder } from '../components/WebcamRecorder/WebcamRecorder';

const ProgressiveUploadDemoPage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Progressive Upload Demo</title>
        <meta name="description" content="Progressive Upload Demo" />
        <link
          rel="icon"
          sizes="16x16"
          href="https://api-video.imgix.net/1631544061-favicon-32x32.png?w=16&amp;h=16"
          type="image/png"
        />
      </Head>

      <main>
        <WebcamRecorder />
      </main>
    </div>
  );
};

export default ProgressiveUploadDemoPage;
