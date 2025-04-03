import classNames from 'classnames';
import { NextPage } from 'next';
import Head from 'next/head';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ApiVideoSvg,
  IconCameraRecorderSvg,
  IconGithubSvg
} from '../../assets/svg';
import { UploadTimeline } from '../../components/UploadTimeline';
import { useStopWatch } from '../../hooks/useStopWatch';
import CTAsection from './CTAsection';
import { RecordButton } from './RecordButton';
import {
  useMediaRecorderDemo,
  UseMediaRecorderDemoArgs
} from './useMediaRecorderDemo';
import { useProgressiveUploaderDemo } from './useProgressiveUploaderDemo';
import { useStandardUploaderDemo } from './useStandardUploaderDemo';

/*
 * This demo uses a delegated upload token
 * https://docs.api.video/reference/get_upload-tokens
 */
const delegatedToken = 'to2mnDziD9cH18l6OZcSWOIe';

/**
 * We need a file size big enough to be able to compare the speed of
 * each upload strategy in this demo.
 * Thus, we force the webcam recording to a fixed duration.
 */
const recordingDurationMs = 60 * 1000; // 60 seconds

export const ProgressiveUploadDemoPage: NextPage = () => {
  // Elapsed time since the standard upload starts
  const [sduDurationMs, setSduDurationMs] = useState(0);
  const [pguDurationMs, setPguDurationMs] = useState(0);

  const {
    start: swStart,
    stop: swStop,
    durationMs,
    durationMsRef
  } = useStopWatch();

  const onStandardUploadFinished = useCallback(() => {
    setSduDurationMs(durationMsRef.current);
  }, [durationMsRef]);

  const onProgressiveUploadFinished = useCallback(() => {
    setPguDurationMs(durationMsRef.current);
  }, [durationMsRef]);

  const {
    bufferSizeBytes: sduBufferSizeBytes,
    videoLink: sduVideoLink,
    isUploading: sduIsUploading,
    prepare: sduPrepare,
    bufferize: sduBufferize,
    uploadAll: sduUploadAll
  } = useStandardUploaderDemo({
    delegatedToken,
    onUploadFinished: onStandardUploadFinished
  });

  const {
    bufferSizeBytes: pguBufferSizeBytes,
    videoLink: pguVideoLink,
    isUploading: pguIsUploading,
    prepare: pguPrepare,
    uploadPart: pguUploadPart,
    uploadLastPart: pguUploadLastPart
  } = useProgressiveUploaderDemo({
    delegatedToken,
    onUploadFinished: onProgressiveUploadFinished
  });

  const onRecordingStarted = useCallback(() => {
    console.log('Recording started');
    sduPrepare();
    pguPrepare();
    setSduDurationMs(0);
    setPguDurationMs(0);
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
        swStart(true);

        console.log('Standard upload all started');
        sduUploadAll();

        console.log('Progressive upload last part', data);
        pguUploadLastPart(data);
      } else {
        console.log('Progressive upload part', data);
        pguUploadPart(data);
      }
    },
    [pguUploadLastPart, pguUploadPart, sduBufferize, sduUploadAll, swStart]
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

  const _pguTimesFaster =
    !isUploading &&
    pguVideoLink !== '' &&
    sduDurationMs !== 0 &&
    pguDurationMs !== 0
      ? sduDurationMs / pguDurationMs
      : undefined;
  const _sduTimesFaster =
    !isUploading &&
    sduVideoLink !== '' &&
    sduDurationMs !== 0 &&
    pguDurationMs !== 0
      ? pguDurationMs / sduDurationMs
      : undefined;

  useEffect(() => {
    if (!isUploading) {
      swStop();
    }
  }, [isUploading, swStop]);

  return (
    <div>
      <Head>
        <title>api.video | Progressive Upload Demo</title>
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
            <div>
              <RecordButton
                recordingTimeLeftMs={recordingTimeLeftMs}
                isRecording={isRecording}
                isUploading={isUploading}
                onClick={onStartRecording}
              />
              <a
                className="py-3 px-5 rounded-md transition-all text-lavenderGray underline underline-d"
                href="https://api.video/blog/tutorials/progressively-upload-large-video-files-without-compromising-on-speed"
                target="_blank"
                rel="noreferrer"
              >
                Learn more
              </a>
            </div>
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
                  muted
                  playsInline
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

        <div className="mx-auto max-w-screen-xl p-8 bg-firefly-light rounded-none xl:rounded-3xl">
          <div className="pb-4">
            <div className="pb-12">
              <UploadTimeline
                withHeader
                title="Progressive upload"
                variant="gradient"
                isRecording={isRecording}
                fileSizeBytes={pguBufferSizeBytes}
                totalDurationMs={pguDurationMs || durationMs}
                videoLink={pguVideoLink}
                isUploading={pguIsUploading}
                timesFaster={2}
                shouldShowSpeedTag={true}
              />
            </div>
            <UploadTimeline
              title="Regular upload"
              variant="uni"
              isRecording={isRecording}
              fileSizeBytes={sduBufferSizeBytes}
              totalDurationMs={0}
              videoLink={sduVideoLink}
              isUploading={sduIsUploading}
              timesFaster={0}
              shouldShowSpeedTag={false}
            />
          </div>
        </div>

        <div className="mx-auto max-w-screen-xl">
          <CTAsection isRecording={isRecording} isUploading={isUploading} />
        </div>
      </main>

      <footer
        className={classNames(
          'mx-auto max-w-screen-xl px-8 pt-4 pb-12',
          'flex items-center justify-between'
        )}
      >
        <div className="flex-grow max-w-lg">
          <p>
            Try{' '}
            <a className="text-lavenderGray underline" href="https://api.video">
              api.video
            </a>{' '}
            for free. |{' '}
            <a
              className="text-lavenderGray underline"
              href="https://api.video/terms-and-conditions"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms
            </a>
          </p>
          <p className="text-sm text-lavenderGray mt-1">
            The end-to-end solution which enables you to easily build, scale and
            operate on-demand and live streaming videos in your app, software or
            platform.
          </p>
        </div>
        <a href="https://github.com/apivideo" target="_blank" rel="noreferrer">
          <IconGithubSvg />
        </a>
      </footer>
    </div>
  );
};
