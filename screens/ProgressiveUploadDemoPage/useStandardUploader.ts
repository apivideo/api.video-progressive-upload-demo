import { VideoUploader } from '@api.video/video-uploader';
import { useCallback, useRef, useState } from 'react';
import { VideoUploadResponse } from '../../types/api_video';

type UseStandardUploaderArgs = {
  readonly delegatedToken: string;
  readonly onUploadSuccess?: (video: VideoUploadResponse) => void;
  readonly onUploadError?: (error: Error) => void;
};

export const useStandardUploader = (args: UseStandardUploaderArgs) => {
  const { delegatedToken, onUploadSuccess, onUploadError } = args;
  const recordedBlobsRef = useRef<Blob[]>([]);
  const [bufferSizeBytes, setBufferSizeBytes] = useState(0);

  const prepare = useCallback(() => {
    recordedBlobsRef.current = [];
    setBufferSizeBytes(0);
  }, []);

  const bufferize = useCallback((data: Blob) => {
    recordedBlobsRef.current.push(data);
    setBufferSizeBytes((prev) => (prev += data.size));
  }, []);

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
    bufferSizeBytes,
    prepare,
    bufferize,
    uploadAll
  };
};
