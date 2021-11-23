import { ProgressiveUploader } from '@api.video/video-uploader';
import { useCallback, useRef } from 'react';
import { VideoUploadResponse } from '../../types/api_video';

type UseProgressiveUploaderArgs = {
  readonly delegatedToken: string;
  readonly onUploadSuccess?: (video: VideoUploadResponse) => void;
  readonly onUploadError?: (error: Error) => void;
};

export const useProgressiveUploader = (args: UseProgressiveUploaderArgs) => {
  const { delegatedToken, onUploadSuccess, onUploadError } = args;
  const progressiveUploaderRef = useRef<ProgressiveUploader>();

  const prepare = useCallback(() => {
    progressiveUploaderRef.current = new ProgressiveUploader({
      uploadToken: delegatedToken
    });
  }, [delegatedToken]);

  const uploadPart = useCallback(
    (data: Blob) => {
      if (progressiveUploaderRef.current === undefined) {
        return;
      }

      // prettier-ignore
      progressiveUploaderRef.current
        .uploadPart(data)
        .catch(onUploadError);
    },
    [onUploadError]
  );

  const uploadLastPart = useCallback(
    (data: Blob) => {
      if (progressiveUploaderRef.current === undefined) {
        return;
      }
      progressiveUploaderRef.current
        .uploadLastPart(data)
        .then(onUploadSuccess)
        .catch(onUploadError);
    },
    [onUploadError, onUploadSuccess]
  );

  return {
    prepare,
    uploadPart,
    uploadLastPart
  };
};
