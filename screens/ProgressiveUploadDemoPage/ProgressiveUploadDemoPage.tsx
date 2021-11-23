import { ProgressiveUploader, VideoUploader } from '@api.video/video-uploader';
import { NextPage } from 'next';
import Head from 'next/head';
import prettyBytes from 'pretty-bytes';
import React, { useCallback, useRef } from 'react';
import {
  WebcamRecorder,
  WebcamRecorderProps
} from '../../components/WebcamRecorder/WebcamRecorder';
import { VideoUploadResponse } from '../../types/api_video';

const delegatedToken = 'to1S7hLQhcujK13kIc3bGHrn';

export const ProgressiveUploadDemoPage: NextPage = () => {
  const recordedBlobsRef = useRef<Blob[]>([]);
  const progressiveUploaderRef = useRef<ProgressiveUploader>();

  const startRef = useRef<Date>();

  const onRecordingStarted = useCallback(() => {
    console.log('Recording started');
    recordedBlobsRef.current = [];

    console.log('Progressive uploaded started');
    progressiveUploaderRef.current = new ProgressiveUploader({
      uploadToken: delegatedToken
    });
    // progressiveUploaderRef.current.onProgress((event) => {
    //   console.log('Progressive upload progress', event);
    // });
    startRef.current = new Date();
  }, []);

  const onRecordingStopped = useCallback(() => {
    console.log('Recording stopped');
  }, []);

  const onRecordingDataReceived = useCallback<
    WebcamRecorderProps['onRecordedDataReceived']
  >(async (data, isLast) => {
    // console.log('Recorded data received', data, isLast);
    recordedBlobsRef.current.push(data);

    if (progressiveUploaderRef.current !== undefined) {
      progressiveUploaderRef.current
        .uploadPart(data)
        .catch((error) =>
          console.log(
            'Progressive upload part error',
            error.status,
            error.message
          )
        );
    }

    if (isLast) {
      const file = new File(recordedBlobsRef.current, 'file');

      console.log('Standard upload started', prettyBytes(file.size));
      const uploader = new VideoUploader({
        file,
        uploadToken: delegatedToken
      });

      uploader
        .upload()
        .then((video: VideoUploadResponse) => {
          console.log('Standard upload end', video.assets.player);
          if (startRef.current !== undefined) {
            console.log(
              'Standard upload duration (ms)',
              new Date().valueOf() - startRef.current.valueOf()
            );
          }
        })
        .catch((error) =>
          console.log('Standard upload error', error.status, error.message)
        );

      // uploader.onProgress((event) => {
      //   console.log('Standard upload progress', event);
      // });

      if (progressiveUploaderRef.current !== undefined) {
        progressiveUploaderRef.current
          .uploadLastPart(data)
          .then((video: VideoUploadResponse) => {
            console.log('Progressive upload end', video.assets.player);

            if (startRef.current !== undefined) {
              console.log(
                'Progressive upload duration (ms)',
                new Date().valueOf() - startRef.current.valueOf()
              );
            }
          })
          .catch((error) =>
            console.log(
              'Progressive upload last part error',
              error.status,
              error.message
            )
          );
      }
    }
  }, []);

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
      </main>
    </div>
  );
};
