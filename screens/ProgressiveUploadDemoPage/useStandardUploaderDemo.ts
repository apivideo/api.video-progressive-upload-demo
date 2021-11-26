import { VideoUploadResponse } from '@api.video/video-uploader/dist/src/common';
import { useCallback, useState } from 'react';
import { useStandardUploader } from '../../hooks/useStandardUploader';

type UseStandardUploaderDemoArgs = {
  readonly delegatedToken: string;
  readonly onUploadFinished?: () => void;
};

export const useStandardUploaderDemo = (args: UseStandardUploaderDemoArgs) => {
  const { delegatedToken, onUploadFinished } = args;

  const [bufferSizeBytes, setBufferSizeBytes] = useState(0);
  const [videoLink, setVideoLink] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const onStandardUploadInit = useCallback(() => {
    setIsUploading(false);
    setBufferSizeBytes(0);
    setVideoLink('');
  }, []);

  const onStandardUploadStarted = useCallback(() => {
    setIsUploading(true);
  }, []);

  const onStandardUploadSuccess = useCallback(
    (video: VideoUploadResponse) => {
      console.log('Standard upload success', video);
      onUploadFinished?.();
      setIsUploading(false);
      setVideoLink(video.assets.player);
    },
    [onUploadFinished]
  );

  const onStandardUploadError = useCallback(
    (error: Error) => {
      console.log('Standard upload error', error);
      onUploadFinished?.();
      setIsUploading(false);
    },
    [onUploadFinished]
  );

  const onBufferBytesAdded = useCallback(
    (bytes) => setBufferSizeBytes((prev) => prev + bytes),
    []
  );

  const standardUploader = useStandardUploader({
    delegatedToken,
    onUploadInit: onStandardUploadInit,
    onUploadStarted: onStandardUploadStarted,
    onUploadSuccess: onStandardUploadSuccess,
    onUploadError: onStandardUploadError,
    onBufferBytesAdded
  });

  return {
    ...standardUploader,
    bufferSizeBytes,
    videoLink,
    isUploading
  };
};
