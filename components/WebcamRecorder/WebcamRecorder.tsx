import classNames from 'classnames';
import prettyBytes from 'pretty-bytes';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';

export type WebcamRecorderProps = Record<string, unknown>;

/**
 * Returns the first preferred supported video mime type.
 */
function getPreferredVideoMimeType() {
  const fileExtensions = ['webm', 'mp4'];

  // https://developer.mozilla.org/en-US/docs/Web/Media/Formats/codecs_parameter
  const codecs = [
    'vp9',
    'vp9.0',
    'vp8',
    'vp8.0',
    'avc1',
    'av1',
    'h265',
    'h.265',
    'h264',
    'h.264',
    'opus'
  ];

  for (const fileExtension of fileExtensions) {
    for (const codec of codecs) {
      /**
       * Testing different mime types variations since
       * - Firefox 94.0.1 and Safari 15.1 seem to support `codecs:` but not `codecs=`
       * - Parameter values may be case sensitive. See: https://www.rfc-editor.org/rfc/rfc2045
       */
      const mimeTypesVariations = [
        `video/${fileExtension};codecs=${codec}`,
        `video/${fileExtension};codecs:${codec}`,
        `video/${fileExtension};codecs=${codec.toUpperCase()}`,
        `video/${fileExtension};codecs:${codec.toUpperCase()}`,
        `video/${fileExtension}`
      ];
      for (const mimeTypeVariation of mimeTypesVariations) {
        if (MediaRecorder.isTypeSupported(mimeTypeVariation)) {
          return { name: mimeTypeVariation, extension: fileExtension };
        }
      }
    }
  }
}

export const WebcamRecorder: React.FC<WebcamRecorderProps> = memo(
  function WebcamRecorder() {
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [downloadLink, setDownloadLink] = useState<string>();
    const [supportedMimeType, setSupportedMimeType] =
      useState<ReturnType<typeof getPreferredVideoMimeType>>();

    const videoRef = useRef<HTMLVideoElement | null>(null);

    const mediaRecorder = useRef<MediaRecorder | null>(null);

    const blobsRecorded = useRef<Blob[]>([]);
    const [totalSizeInBytes, setTotalSizeInBytes] = useState(0);

    useEffect(() => {
      setSupportedMimeType(getPreferredVideoMimeType());
    }, []);

    const onStartCamera = useCallback(async () => {
      try {
        // Ask for user permission to use webcam media stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setCameraStream(stream);

        // Set webcam stream to video element
        if (videoRef.current !== null) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        setCameraStream(null);
        videoRef.current = null;
      }
    }, []);

    const onStartRecording = useCallback(() => {
      if (cameraStream === null) {
        return;
      }

      blobsRecorded.current = [];
      setTotalSizeInBytes(0);

      const recorder = new MediaRecorder(cameraStream, {
        mimeType: supportedMimeType?.name
      });
      recorder.addEventListener('dataavailable', function (e) {
        blobsRecorded.current.push(e.data);
        setTotalSizeInBytes((prev) => prev + e.data.size);
      });
      recorder.addEventListener('stop', function () {
        if (blobsRecorded.current.length === 0) {
          return;
        }
        // Revoke previous object URL
        if (downloadLink !== undefined) {
          URL.revokeObjectURL(downloadLink);
        }
        const newDownloadLink = URL.createObjectURL(
          new Blob(blobsRecorded.current, {
            type: supportedMimeType?.name
          })
        );
        setDownloadLink(newDownloadLink);
      });

      recorder.start(1000); // Start recording 1 second of video into each Blob

      mediaRecorder.current = recorder;
      setIsRecording(true);
    }, [cameraStream, downloadLink, supportedMimeType?.name]);

    const onStopRecording = useCallback(() => {
      if (mediaRecorder.current !== null) {
        mediaRecorder.current.stop();
        mediaRecorder.current = null;
      }
      setIsRecording(false);
    }, []);

    const isCameraStreamInitialized = cameraStream !== null;

    return (
      <div>
        <p>Mime Type: {supportedMimeType?.name}</p>
        <p>Total size on disk: {prettyBytes(totalSizeInBytes)}</p>
        <video
          className={classNames({ hidden: !isCameraStreamInitialized })}
          autoPlay
          ref={videoRef}
        ></video>
        <button
          className={classNames({ hidden: isCameraStreamInitialized })}
          onClick={onStartCamera}
        >
          Start Camera
        </button>
        <button
          className={classNames({
            hidden: !isCameraStreamInitialized || isRecording
          })}
          onClick={onStartRecording}
        >
          Start Recording
        </button>
        <button
          className={classNames({ hidden: !isRecording })}
          onClick={onStopRecording}
        >
          Stop Recording
        </button>
        <a
          className={classNames({
            hidden: downloadLink === undefined || isRecording
          })}
          download={`demo.${supportedMimeType?.extension}`}
          href={downloadLink}
        >
          Download Video
        </a>
      </div>
    );
  }
);
