import { VideoUploadResponse } from '@api.video/video-uploader/dist/src/common';
import { useCallback, useState } from 'react';
import { useProgressiveUploader } from '../../hooks/useProgressiveUploader';

type UseProgressiveUploaderDemoArgs = {
  readonly delegatedToken: string;
  readonly onUploadFinished?: () => void;
};

export const useProgressiveUploaderDemo = (
  args: UseProgressiveUploaderDemoArgs
) => {
  const { delegatedToken, onUploadFinished } = args;

  const [bufferSizeBytes, setBufferSizeBytes] = useState(0);
  const [videoLink, setVideoLink] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const onProgressiveUploadInit = useCallback(() => {
    setIsUploading(true);
    setBufferSizeBytes(0);
    setVideoLink('');
  }, []);

  const onProgressiveUploadSuccess = useCallback(
    (video: VideoUploadResponse) => {
      console.log('Progressive upload success', video);
      onUploadFinished?.();
      setIsUploading(false);
      setVideoLink(video.assets.player);
    },
    [onUploadFinished]
  );

  const onProgressiveUploadError = useCallback(
    (error: Error) => {
      console.log('Progressive upload error', error);
      onUploadFinished?.();
      setIsUploading(false);
    },
    [onUploadFinished]
  );

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
    videoLink,
    isUploading
  };
};
