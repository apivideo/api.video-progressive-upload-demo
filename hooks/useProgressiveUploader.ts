import { ProgressiveUploader } from '@api.video/video-uploader';
import { VideoUploadResponse } from '@api.video/video-uploader/dist/src/common';
import PQueue from 'p-queue';
import { useCallback, useRef } from 'react';

type UseProgressiveUploaderArgs = {
  readonly delegatedToken: string;
  readonly onUploadInit?: () => void;
  readonly onUploadStarted?: () => void;
  readonly onUploadSuccess?: (video: VideoUploadResponse) => void;
  readonly onUploadError?: (error: Error) => void;
  readonly onBufferBytesAdded?: (bytes: number) => void;
  readonly onBufferBytesRemoved?: (bytes: number) => void;
};

export const useProgressiveUploader = (args: UseProgressiveUploaderArgs) => {
  const {
    delegatedToken,
    onUploadInit,
    onUploadStarted,
    onUploadSuccess,
    onUploadError,
    onBufferBytesAdded,
    onBufferBytesRemoved
  } = args;
  const progressiveUploaderRef = useRef<ProgressiveUploader>();

  // We need a queue to preserve chunks upload order, especially for slow connections.
  const partsToUploadQueueRef = useRef(new PQueue({ concurrency: 1 }));

  const isUploadingFirstPartRef = useRef(true);

  const prepare = useCallback(() => {
    onUploadInit?.();
    isUploadingFirstPartRef.current = true;
    partsToUploadQueueRef.current.clear();
    progressiveUploaderRef.current = new ProgressiveUploader({
      uploadToken: delegatedToken
    });
    progressiveUploaderRef.current.onProgress((event) => {
      if (event.uploadedBytes >= event.totalBytes) {
        onBufferBytesRemoved?.(event.totalBytes);
      }
      if (isUploadingFirstPartRef.current) {
        onUploadStarted?.();
        isUploadingFirstPartRef.current = false;
      }
    });
  }, [delegatedToken, onBufferBytesRemoved, onUploadInit, onUploadStarted]);

  const uploadPart = useCallback(
    async (data: Blob) => {
      onBufferBytesAdded?.(data.size);
      partsToUploadQueueRef.current.add(async () => {
        if (progressiveUploaderRef.current === undefined) {
          return;
        }
        return progressiveUploaderRef.current
          .uploadPart(data)
          .catch(onUploadError);
      });
    },
    [onBufferBytesAdded, onUploadError]
  );

  const uploadLastPart = useCallback(
    (data: Blob) => {
      onBufferBytesAdded?.(data.size);
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
    [onBufferBytesAdded, onUploadError, onUploadSuccess]
  );

  return {
    prepare,
    uploadPart,
    uploadLastPart
  };
};
