import { VideoUploadResponse } from '@api.video/video-uploader/dist/src/common';
import { useCallback, useState } from 'react';
import { useProgressiveUploader } from '../../hooks/useProgressiveUploader';
import { useStopWatch } from '../../hooks/useStopWatch';

type UseProgressiveUploaderDemoArgs = {
  readonly delegatedToken: string;
};

export const useProgressiveUploaderDemo = (
  args: UseProgressiveUploaderDemoArgs
) => {
  const { delegatedToken } = args;

  const {
    start: swStart,
    stop: swStop,
    durationMs: swDurationMs
  } = useStopWatch();

  const [bufferSizeBytes, setBufferSizeBytes] = useState(0);
  const [videoLink, setVideoLink] = useState<string>('');

  const onProgressiveUploadInit = useCallback(() => {
    swStart(true);
    setBufferSizeBytes(0);
    setVideoLink('');
  }, [swStart]);

  const onProgressiveUploadSuccess = useCallback(
    (video: VideoUploadResponse) => {
      console.log('Progressive upload success', video);
      swStop();
      setVideoLink(video.assets.player);
    },
    [swStop]
  );

  const onProgressiveUploadError = useCallback((error: Error) => {
    console.log('Progressive upload error', error);
  }, []);

  const onBufferBytesAdded = useCallback(
    (bytes) => setBufferSizeBytes((prev) => prev + bytes),
    []
  );

  const onBufferBytesRemoved = useCallback(
    (bytes) => setBufferSizeBytes((prev) => prev - bytes),
    []
  );

  const progressiveUploader = useProgressiveUploader({
    delegatedToken,
    onUploadInit: onProgressiveUploadInit,
    onUploadSuccess: onProgressiveUploadSuccess,
    onUploadError: onProgressiveUploadError,
    onBufferBytesAdded,
    onBufferBytesRemoved
  });

  return {
    ...progressiveUploader,
    bufferSizeBytes,
    durationMs: swDurationMs,
    videoLink
  };
};
