import { useCallback, useRef, useState } from 'react';
import { VideoStreamMerger } from 'video-stream-merger';
import { useMediaStreamRecorder } from './useMediaStreamRecorder';
import { useScreenMediaStream } from './useScreenMediaStream';
import { useWebcamMediaStream } from './useWebcamMediaStream';

type UseScreencastRecorderArgs = {
  readonly onRecordingStarted?: () => void;
  readonly onRecordingStopped?: () => void;
  readonly onRecordedDataReceived?: (data: Blob, isLastData: boolean) => void;
};

export const useScreencastRecorder = (args: UseScreencastRecorderArgs) => {
  const { onRecordingStarted, onRecordingStopped, onRecordedDataReceived } =
    args;

  // Webcam and Screen streams merged together
  const [mergedStream, setMergedStream] = useState<MediaStream | null>(null);

  const { onRequestWebcamStreamPermission } = useWebcamMediaStream();
  const { onRequestScreenStreamPermission } = useScreenMediaStream();

  const { isRecording, onStartRecording, onStopRecording } =
    useMediaStreamRecorder({
      stream: mergedStream,
      onRecordedDataReceived,
      onRecordingStarted,
      onRecordingStopped
    });

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const onRequestPermissions = useCallback(async () => {
    try {
      const webcamStream = await onRequestWebcamStreamPermission();
      const screenStream = await onRequestScreenStreamPermission();

      // https://github.com/t-mullen/video-stream-merger#merger--new-videostreammergeropts
      const merger = new VideoStreamMerger({
        width: 1920,
        height: 1080,
        fps: 25,
        clearRect: true,
        audioContext: new AudioContext()
      });

      // Add the screen capture. Position it to fill the whole stream (the default)
      // https://github.com/t-mullen/video-stream-merger#mergeraddstreammediastreamid-opts
      // @ts-ignore
      merger.addStream(screenStream, {
        x: 0,
        y: 0,
        width: merger.width,
        height: merger.height,
        mute: true // we don't want sound from the screen (if there is any)
      });

      // Add the webcam stream. Position it on the bottom left and resize it
      // https://github.com/t-mullen/video-stream-merger#mergeraddstreammediastreamid-opts
      // @ts-ignore
      merger.addStream(webcamStream, {
        x: 20,
        y: merger.height - merger.height / 3,
        width: merger.width / 3,
        height: merger.height / 3,
        mute: false
      });

      merger.start();

      const stream = merger.result;
      setMergedStream(stream);

      // Set webcam stream to the given video element
      if (videoRef.current !== null) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      setMergedStream(null);
      videoRef.current = null;
    }
  }, [onRequestScreenStreamPermission, onRequestWebcamStreamPermission]);

  return {
    onRequestPermissions,
    onStartRecording,
    onStopRecording,
    videoRef,
    isStreamInitialized: mergedStream !== null,
    isRecording
  };
};
