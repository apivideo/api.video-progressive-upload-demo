import classNames from 'classnames';
import { NextPage } from 'next';
import Head from 'next/head';
import prettyBytes from 'pretty-bytes';
import prettyMilliseconds from 'pretty-ms';
import React, { useCallback } from 'react';
import {
  ApiVideoSvg,
  IconCameraRecorderSvg,
  IconGithubSvg
} from '../../assets/svg';
import { UploadTimeline } from '../../components/UploadTimeline';
import { RecordButton } from './RecordButton';
import {
  useMediaRecorderDemo,
  UseMediaRecorderDemoArgs
} from './useMediaRecorderDemo';
import { useProgressiveUploaderDemo } from './useProgressiveUploaderDemo';
import { useStandardUploaderDemo } from './useStandardUploaderDemo';

const delegatedToken = 'to1S7hLQhcujK13kIc3bGHrn';

/**
 * We need a file size big enough to be able to compare the speed of
 * each upload strategy in this demo.
 * Thus, we force the webcam recording to a fixed duration.
 */
const recordingDurationMs = 60 * 1000; // 60 seconds

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
    NonNullable<UseMediaRecorderDemoArgs['onRecordedDataReceived']>
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
    isStreamInitialized,
    isRecording,
    recordingTimeLeftMs,
    onStartRecording
  } = useMediaRecorderDemo({
    recordingDurationMs,
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
            <ApiVideoSvg className="pb-6 box-content" />
            <h1 className="text-3xl-2 font-black py-6">
              Record &amp; upload simultaneously with Progressive Upload
            </h1>
            <h2 className="text-lavenderGray font-medium text-xl pb-12">
              Save time and instantly share your recorded video. Try it below
              for yourself!
            </h2>
            <RecordButton
              recordingTimeLeftMs={recordingTimeLeftMs}
              isRecording={isRecording}
              isUploading={isUploading}
              onClick={onStartRecording}
            />
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
              {isStreamInitialized ? (
                <video
                  className="object-cover rounded-3xl"
                  autoPlay
                  ref={videoRef}
                />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <IconCameraRecorderSvg />

                  <div className="text-center pt-8 font-medium text-sm">
                    Press{' '}
                    <button
                      className="text-outrageousOrange underline"
                      onClick={onStartRecording}
                    >
                      start recording
                    </button>
                    <br />
                    to play with the Progressive Upload
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-screen-xl p-8 bg-firefly-light rounded-none md:rounded-3xl">
          <div className="pb-4">
            <div className="pb-8">
              <UploadTimeline
                title={<span>api.video</span>}
                withHeader
                variant="gradient"
              />
            </div>
            <UploadTimeline title="Regular upload" variant="uni" />

            <br />

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

      <footer
        className={classNames(
          'mx-auto max-w-screen-xl px-8 pt-4 pb-12',
          'flex items-center'
        )}
      >
        <span className="flex-grow">
          Try{' '}
          <a className="text-lavenderGray underline" href="https://api.video">
            api.video
          </a>{' '}
          for free
        </span>
        <a href="https://github.com/apivideo" target="_blank" rel="noreferrer">
          <IconGithubSvg />
        </a>
      </footer>
    </div>
  );
};
