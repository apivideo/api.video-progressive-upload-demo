import { ProgressiveUploader } from '@api.video/video-uploader';
import PQueue from 'p-queue';
import { useCallback, useRef, useState } from 'react';
import { VideoUploadResponse } from '../../types/api_video';

type UseProgressiveUploaderArgs = {
  readonly delegatedToken: string;
  readonly onUploadSuccess?: (video: VideoUploadResponse) => void;
  readonly onUploadError?: (error: Error) => void;
};

export const useProgressiveUploader = (args: UseProgressiveUploaderArgs) => {
  const { delegatedToken, onUploadSuccess, onUploadError } = args;
  const progressiveUploaderRef = useRef<ProgressiveUploader>();

  // We need a queue to preserve chunks upload order, especially for slow connections.
  const partsToUploadQueueRef = useRef(new PQueue({ concurrency: 1 }));
  const [bufferSizeBytes, setBufferSizeBytes] = useState(0);

  const prepare = useCallback(() => {
    setBufferSizeBytes(0);
    partsToUploadQueueRef.current.clear();
    progressiveUploaderRef.current = new ProgressiveUploader({
      uploadToken: delegatedToken
    });
    progressiveUploaderRef.current.onProgress((event) => {
      if (event.uploadedBytes >= event.totalBytes) {
        setBufferSizeBytes((prev) => prev - event.totalBytes);
      }
    });
  }, [delegatedToken]);

  const uploadPart = useCallback(
    async (data: Blob) => {
      setBufferSizeBytes((prev) => prev + data.size);
      partsToUploadQueueRef.current.add(async () => {
        if (progressiveUploaderRef.current === undefined) {
          return;
        }
        return progressiveUploaderRef.current
          .uploadPart(data)
          .catch(onUploadError);
      });
    },
    [onUploadError]
  );

  const uploadLastPart = useCallback(
    (data: Blob) => {
      setBufferSizeBytes((prev) => prev + data.size);
      partsToUploadQueueRef.current.add(async () => {
        if (progressiveUploaderRef.current === undefined) {
          return;
        }
        return progressiveUploaderRef.current
          .uploadLastPart(data)
          .then(onUploadSuccess)
          .catch(onUploadError);
      });
    },
    [onUploadError, onUploadSuccess]
  );

  return {
    bufferSizeBytes,
    prepare,
    uploadPart,
    uploadLastPart
  };
};
