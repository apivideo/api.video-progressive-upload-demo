import { VideoUploadResponse } from '@api.video/video-uploader/dist/src/common';
import { useCallback, useState } from 'react';
import { useStandardUploader } from '../../hooks/useStandardUploader';
import { useStopWatch } from '../../hooks/useStopWatch';

type UseStandardUploaderDemoArgs = {
  readonly delegatedToken: string;
};

export const useStandardUploaderDemo = (args: UseStandardUploaderDemoArgs) => {
  const { delegatedToken } = args;

  const {
    start: swStart,
    stop: swStop,
    durationMs: swDurationMs
  } = useStopWatch();

  const [bufferSizeBytes, setBufferSizeBytes] = useState(0);
  const [videoLink, setVideoLink] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const onStandardUploadInit = useCallback(() => {
    swStart(true);
    setIsUploading(true);
    setBufferSizeBytes(0);
    setVideoLink('');
  }, [swStart]);

  const onStandardUploadSuccess = useCallback(
    (video: VideoUploadResponse) => {
      console.log('Standard upload success', video);
      swStop();
      setIsUploading(false);
      setVideoLink(video.assets.player);
    },
    [swStop]
  );

  const onStandardUploadError = useCallback(
    (error: Error) => {
      console.log('Standard upload error', error);
      swStop();
      setIsUploading(false);
    },
    [swStop]
  );

  const onBufferBytesAdded = useCallback(
    (bytes) => setBufferSizeBytes((prev) => prev + bytes),
    []
  );

  const standardUploader = useStandardUploader({
    delegatedToken,
    onUploadInit: onStandardUploadInit,
    onUploadSuccess: onStandardUploadSuccess,
    onUploadError: onStandardUploadError,
    onBufferBytesAdded
  });

  return {
    ...standardUploader,
    bufferSizeBytes,
    durationMs: swDurationMs,
    videoLink,
    isUploading
  };
};
