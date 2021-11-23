import { useCallback, useRef, useState } from 'react';
import { useProgressiveUploader } from '../../hooks/useProgressiveUploader';
import { VideoUploadResponse } from '../../types/api_video';

type UseProgressiveUploaderDemoArgs = {
  readonly delegatedToken: string;
};

export const useProgressiveUploaderDemo = (
  args: UseProgressiveUploaderDemoArgs
) => {
  const { delegatedToken } = args;

  const startRef = useRef<Date>();

  const [bufferSizeBytes, setBufferSizeBytes] = useState(0);

  const onProgressiveUploadInit = useCallback(() => setBufferSizeBytes(0), []);

  const onProgressiveUploadSuccess = useCallback(
    (video: VideoUploadResponse) => {
      console.log('Progressive upload success', video);
      if (startRef.current !== undefined) {
        console.log(
          'Progressive upload duration (ms)',
          new Date().valueOf() - startRef.current.valueOf()
        );
      }
    },
    []
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
    bufferSizeBytes
  };
};
