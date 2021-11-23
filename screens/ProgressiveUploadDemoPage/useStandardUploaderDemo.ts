import { VideoUploadResponse } from '@api.video/video-uploader/dist/src/common';
import { useCallback, useRef, useState } from 'react';
import { useStandardUploader } from '../../hooks/useStandardUploader';

type UseStandardUploaderDemoArgs = {
  readonly delegatedToken: string;
};

export const useStandardUploaderDemo = (args: UseStandardUploaderDemoArgs) => {
  const { delegatedToken } = args;

  const startRef = useRef<Date>();

  const [bufferSizeBytes, setBufferSizeBytes] = useState(0);

  const onStandardUploadInit = useCallback(() => setBufferSizeBytes(0), []);

  const onStandardUploadSuccess = useCallback((video: VideoUploadResponse) => {
    console.log('Standard upload success', video);
    if (startRef.current !== undefined) {
      console.log(
        'Standard upload duration (ms)',
        new Date().valueOf() - startRef.current.valueOf()
      );
    }
  }, []);
  const onStandardUploadError = useCallback((error: Error) => {
    console.log('Standard upload error', error);
  }, []);

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
    bufferSizeBytes
  };
};
