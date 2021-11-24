import { NextPage } from 'next';
import Head from 'next/head';
import prettyBytes from 'pretty-bytes';
import prettyMilliseconds from 'pretty-ms';
import React, { useCallback } from 'react';
import {
  WebcamRecorder,
  WebcamRecorderProps
} from '../../components/WebcamRecorder/WebcamRecorder';
import { useProgressiveUploaderDemo } from './useProgressiveUploaderDemo';
import { useStandardUploaderDemo } from './useStandardUploaderDemo';

const delegatedToken = 'to1S7hLQhcujK13kIc3bGHrn';

export const ProgressiveUploadDemoPage: NextPage = () => {
  const {
    durationMs: sduDurationMs,
    bufferSizeBytes: sduBufferSizeBytes,
    videoLink: sduVideoLink,
    prepare: sduPrepare,
    bufferize: sduBufferize,
    uploadAll: sduUploadAll
  } = useStandardUploaderDemo({ delegatedToken });

  const {
    durationMs: pguDurationMs,
    bufferSizeBytes: pguBufferSizeBytes,
    videoLink: pguVideoLink,
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

  const onRecordingDataReceived = useCallback<
    NonNullable<WebcamRecorderProps['onRecordedDataReceived']>
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

        <br />

        <div>
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

        <br />

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
      </main>
    </div>
  );
};
