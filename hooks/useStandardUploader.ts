import { VideoUploader } from '@api.video/video-uploader';
import { VideoUploadResponse } from '@api.video/video-uploader/dist/src/common';
import { useCallback, useRef } from 'react';

type UseStandardUploaderArgs = {
  readonly delegatedToken: string;
  readonly onUploadInit?: () => void;
  readonly onUploadStarted?: () => void;
  readonly onUploadSuccess?: (video: VideoUploadResponse) => void;
  readonly onUploadError?: (error: Error) => void;
  readonly onBufferBytesAdded?: (bytes: number) => void;
};

export const useStandardUploader = (args: UseStandardUploaderArgs) => {
  const {
    delegatedToken,
    onUploadInit,
    onUploadStarted,
    onUploadSuccess,
    onUploadError,
    onBufferBytesAdded
  } = args;
  const recordedBlobsRef = useRef<Blob[]>([]);

  const prepare = useCallback(() => {
    onUploadInit?.();
    recordedBlobsRef.current = [];
  }, [onUploadInit]);

  const bufferize = useCallback(
    (data: Blob) => {
      recordedBlobsRef.current.push(data);
      onBufferBytesAdded?.(data.size);
    },
    [onBufferBytesAdded]
  );

  const uploadAll = useCallback(() => {
    const file = new File(recordedBlobsRef.current, 'upstream-demo-file');

    const uploader = new VideoUploader({
      file,
      uploadToken: delegatedToken
    });

    onUploadStarted?.();

    // prettier-ignore
    uploader.upload()
      .then(onUploadSuccess)
      .catch(onUploadError);
  }, [delegatedToken, onUploadError, onUploadStarted, onUploadSuccess]);

  return {
    prepare,
    bufferize,
    uploadAll
  };
};
