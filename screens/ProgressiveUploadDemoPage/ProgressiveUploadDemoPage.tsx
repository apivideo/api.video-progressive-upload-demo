import classNames from 'classnames';
import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import prettyBytes from 'pretty-bytes';
import prettyMilliseconds from 'pretty-ms';
import React, { useCallback } from 'react';
import { useProgressiveUploaderDemo } from './useProgressiveUploaderDemo';
import { useStandardUploaderDemo } from './useStandardUploaderDemo';
import {
  useWebcamRecorderDemo,
  UseWebcamRecorderDemoArgs
} from './useWebcamRecorderDemo';

const delegatedToken = 'to1S7hLQhcujK13kIc3bGHrn';

export const ProgressiveUploadDemoPage: NextPage = () => {
  const {
    durationMs: sduDurationMs,
    bufferSizeBytes: sduBufferSizeBytes,
    videoLink: sduVideoLink,
    isUploading: sduIsUploading,
    prepare: sduPrepare,
    bufferize: sduBufferize,
    uploadAll: sduUploadAll
  } = useStandardUploaderDemo({ delegatedToken });

  const {
    durationMs: pguDurationMs,
    bufferSizeBytes: pguBufferSizeBytes,
    videoLink: pguVideoLink,
    isUploading: pguIsUploading,
    prepare: pguPrepare,
    uploadPart: pguUploadPart,
    uploadLastPart: pguUploadLastPart
  } = useProgressiveUploaderDemo({
    delegatedToken
  });

  const onRecordingStarted = useCallback(() => {
    console.log('Recording started');
    sduPrepare();
    pguPrepare();
  }, [pguPrepare, sduPrepare]);

  const onRecordingStopped = useCallback(() => {
    console.log('Recording stopped');
  }, []);

  const onRecordedDataReceived = useCallback<
    NonNullable<UseWebcamRecorderDemoArgs['onRecordedDataReceived']>
  >(
    (data, isLast) => {
      console.log('Standard upload bufferize', data);
      sduBufferize(data);

      if (isLast) {
        console.log('Standard upload all started');
        sduUploadAll();

        console.log('Progressive upload last part', data);
        pguUploadLastPart(data);
      } else {
        console.log('Progressive upload part', data);
        pguUploadPart(data);
      }
    },
    [pguUploadLastPart, pguUploadPart, sduBufferize, sduUploadAll]
  );

  const {
    videoRef,
    isCameraStreamInitialized,
    isRecording,
    recordingTimeLeftMs,
    onStartCamera,
    onStartRecording
  } = useWebcamRecorderDemo({
    onRecordingStarted,
    onRecordingStopped,
    onRecordedDataReceived
  });

  const isUploading = sduIsUploading || pguIsUploading;

  return (
    <div>
      <Head>
        <title>Progressive Upload Demo</title>
        <meta name="description" content="Progressive Upload Demo" />
      </Head>

      <main className="py-16">
        <div
          className={classNames(
            'grid grid-cols-8 gap-8',
            'mx-auto max-w-screen-xl px-8',
            'pb-16'
          )}
        >
          <div className="md:col-span-3 col-span-8">
            <Image
              className="pb-6"
              src="/logo.svg"
              width={120}
              height={112.5}
              alt="api.video"
            />
            <h1 className="text-3xl-2 font-black py-6">
              Record &amp; upload simultaneously with Progressive Upload
            </h1>
            <h2 className="text-lavenderGray font-medium text-xl">
              Save time and instantly share your recorded video. Try it below
              for yourself!
            </h2>
            <button
              disabled={
                !isCameraStreamInitialized || isRecording || isUploading
              }
              onClick={onStartRecording}
            >
              Start recording ({prettyMilliseconds(recordingTimeLeftMs)})
            </button>
          </div>
          <div className="md:col-span-5 col-span-8">
            <div
              className={classNames(
                'md:ml-14',
                'aspect-w-16 aspect-h-9',
                'bg-fiord',
                'rounded-3xl overflow-hidden'
              )}
            >
              {isCameraStreamInitialized ? (
                <video className="object-cover" autoPlay ref={videoRef} />
              ) : (
                <button onClick={onStartCamera}>Start Camera</button>
              )}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-screen-xl px-8">
          <div className="pb-4">
            <h1>Standard Upload</h1>
            <p>File size: {prettyBytes(sduBufferSizeBytes)}</p>
            <p>
              Duration:{' '}
              {prettyMilliseconds(sduDurationMs, {
                colonNotation: true
              })}
            </p>
            <p>
              Video Link:{' '}
              {sduVideoLink !== '' ? (
                <a href={sduVideoLink} target="_blank" rel="noreferrer">
                  {sduVideoLink}
                </a>
              ) : null}
            </p>
          </div>

          <div>
            <h1>Progressive Upload</h1>
            <p>File size: {prettyBytes(pguBufferSizeBytes)}</p>
            <p>
              Duration:{' '}
              {prettyMilliseconds(pguDurationMs, {
                colonNotation: true
              })}
            </p>
            <p>
              Video Link:{' '}
              {pguVideoLink !== '' ? (
                <a href={pguVideoLink} target="_blank" rel="noreferrer">
                  {pguVideoLink}
                </a>
              ) : null}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
