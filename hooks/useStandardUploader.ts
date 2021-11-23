import { VideoUploader } from '@api.video/video-uploader';
import { useCallback, useRef } from 'react';
import { VideoUploadResponse } from '../types/api_video';

type UseStandardUploaderArgs = {
  readonly delegatedToken: string;
  readonly onUploadInit?: () => void;
  readonly onUploadSuccess?: (video: VideoUploadResponse) => void;
  readonly onUploadError?: (error: Error) => void;
  readonly onBufferBytesAdded?: (bytes: number) => void;
};

export const useStandardUploader = (args: UseStandardUploaderArgs) => {
  const {
    delegatedToken,
    onUploadInit,
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
    const file = new File(recordedBlobsRef.current, 'file');

    const uploader = new VideoUploader({
      file,
      uploadToken: delegatedToken
    });

    // prettier-ignore
    uploader.upload()
      .then(onUploadSuccess)
      .catch(onUploadError);
  }, [delegatedToken, onUploadError, onUploadSuccess]);

  return {
    prepare,
    bufferize,
    uploadAll
  };
};
