import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';

export type CTAsectionProps = {
  readonly isRecording: boolean;
  readonly isUploading: boolean;
};

const CTAsection = ({ isRecording, isUploading }: CTAsectionProps) => {
  const isFirstRecordingRef = useRef(true);
  useEffect(() => {
    if (isRecording) {
      isFirstRecordingRef.current = false;
    }
  }, [isRecording]);
  return (
    <div
      className={classNames(
        'flex flex-col sm:flex-row justify-between p-8 mt-4 border border-outrageousOrange rounded-none xl:rounded-3xl',
        {
          // variants
          'bg-outrageousOrange':
            !isRecording && !isUploading && !isFirstRecordingRef.current
        }
      )}
    >
      <div>
        <h3 className="text-2xl pb-2 font-black">Create your free account</h3>
        <p>Start building with video now. No cc required.</p>
      </div>
      <a
        className={classNames(
          'inline-block self-start py-3 px-5 mt-6 sm:mt-0 w-full sm:w-auto text-center rounded-md font-bold transition-all ',
          {
            'bg-firefly':
              !isRecording && !isUploading && !isFirstRecordingRef.current,
            'bg-outrageousOrange':
              !isRecording && !isUploading && isFirstRecordingRef.current
          }
        )}
        href="https://dashboard.api.video/register"
      >
        Get started
      </a>
    </div>
  );
};

export default CTAsection;
