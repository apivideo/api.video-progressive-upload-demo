import { NextPage } from 'next';
import Head from 'next/head';
import prettyBytes from 'pretty-bytes';
import React, { useCallback, useRef } from 'react';
import {
  WebcamRecorder,
  WebcamRecorderProps
} from '../../components/WebcamRecorder/WebcamRecorder';
import { useProgressiveUploaderDemo } from './useProgressiveUploaderDemo';
import { useStandardUploaderDemo } from './useStandardUploaderDemo';

const delegatedToken = 'to1S7hLQhcujK13kIc3bGHrn';

export const ProgressiveUploadDemoPage: NextPage = () => {
  const startRef = useRef<Date>();

  const standardUploaderDemo = useStandardUploaderDemo({ delegatedToken });
  const progressiveUploaderDemo = useProgressiveUploaderDemo({
    delegatedToken
  });

  const onRecordingStarted = useCallback(() => {
    console.log('Recording started');
    startRef.current = new Date();

    standardUploaderDemo.prepare();
    progressiveUploaderDemo.prepare();
  }, [progressiveUploaderDemo, standardUploaderDemo]);

  const onRecordingStopped = useCallback(() => {
    console.log('Recording stopped');
  }, []);

  const onRecordingDataReceived = useCallback<
    NonNullable<WebcamRecorderProps['onRecordedDataReceived']>
  >(
    (data, isLast) => {
      console.log('Standard upload bufferize', data);
      standardUploaderDemo.bufferize(data);

      if (isLast) {
        console.log('Standard upload all started');
        standardUploaderDemo.uploadAll();

        console.log('Progressive upload last part', data);
        progressiveUploaderDemo.uploadLastPart(data);
      } else {
        console.log('Progressive upload part', data);
        progressiveUploaderDemo.uploadPart(data);
      }
    },
    [progressiveUploaderDemo, standardUploaderDemo]
  );

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
        <WebcamRecorder
          onRecordingStarted={onRecordingStarted}
          onRecordingStopped={onRecordingStopped}
          onRecordedDataReceived={onRecordingDataReceived}
        />
        <p>
          Standard upload - File size on disk:{' '}
          {prettyBytes(standardUploaderDemo.bufferSizeBytes)}
        </p>
        <p>
          Progressive upload - File size on disk:{' '}
          {prettyBytes(progressiveUploaderDemo.bufferSizeBytes)}
        </p>
      </main>
    </div>
  );
};
