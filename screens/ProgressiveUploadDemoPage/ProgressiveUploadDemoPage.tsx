import { NextPage } from 'next';
import Head from 'next/head';
import prettyBytes from 'pretty-bytes';
import React, { useCallback, useRef } from 'react';
import {
  WebcamRecorder,
  WebcamRecorderProps
} from '../../components/WebcamRecorder/WebcamRecorder';
import { VideoUploadResponse } from '../../types/api_video';
import { useProgressiveUploader } from './useProgressiveUploader';
import { useStandardUploader } from './useStandardUploader';

const delegatedToken = 'to1S7hLQhcujK13kIc3bGHrn';

export const ProgressiveUploadDemoPage: NextPage = () => {
  const startRef = useRef<Date>();

  const onStandardUploadSuccess = useCallback((video: VideoUploadResponse) => {
    console.log('Standard upload success', video);
    if (startRef.current !== undefined) {
      console.log(
        'Standard upload duration (ms)',
        new Date().valueOf() - startRef.current.valueOf()
      );
    }
  }, []);
  const onStandardUploadError = useCallback((error: Error) => {
    console.log('Standard upload error', error);
  }, []);

  const onProgressiveUploadSuccess = useCallback(
    (video: VideoUploadResponse) => {
      console.log('Progressive upload success', video);
      if (startRef.current !== undefined) {
        console.log(
          'Progressive upload duration (ms)',
          new Date().valueOf() - startRef.current.valueOf()
        );
      }
    },
    []
  );
  const onProgressiveUploadError = useCallback((error: Error) => {
    console.log('Progressive upload error', error);
  }, []);

  const standardUploader = useStandardUploader({
    delegatedToken,
    onUploadSuccess: onStandardUploadSuccess,
    onUploadError: onStandardUploadError
  });
  const progressiveUploader = useProgressiveUploader({
    delegatedToken,
    onUploadSuccess: onProgressiveUploadSuccess,
    onUploadError: onProgressiveUploadError
  });

  const onRecordingStarted = useCallback(() => {
    console.log('Recording started');
    startRef.current = new Date();

    standardUploader.prepare();
    progressiveUploader.prepare();
  }, [progressiveUploader, standardUploader]);

  const onRecordingStopped = useCallback(() => {
    console.log('Recording stopped');
  }, []);

  const onRecordingDataReceived = useCallback<
    NonNullable<WebcamRecorderProps['onRecordedDataReceived']>
  >(
    (data, isLast) => {
      console.log('Standard upload bufferize', data);
      standardUploader.bufferize(data);

      if (isLast) {
        console.log('Standard upload all started');
        standardUploader.uploadAll();

        console.log('Progressive upload last part', data);
        progressiveUploader.uploadLastPart(data);
      } else {
        console.log('Progressive upload part', data);
        progressiveUploader.uploadPart(data);
      }
    },
    [progressiveUploader, standardUploader]
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
          {prettyBytes(standardUploader.bufferSizeBytes)}
        </p>
        <p>
          Progressive upload - File size on disk:{' '}
          {prettyBytes(progressiveUploader.bufferSizeBytes)}
        </p>
      </main>
    </div>
  );
};
