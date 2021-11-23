// TODO: Fix upload response type in `VideoUploader`
// https://github.com/apivideo/api.video-typescript-uploader/blob/41e571cac7d4b0cb7727f93693a931ce93c71170/dist/src/video-uploader.d.ts#L37
export type VideoUploadResponse = {
  readonly videoId: string;
  readonly title: string;
  readonly description: string;
  readonly public: boolean;
  readonly panoramic: boolean;
  readonly mp4Support: boolean;
  readonly publishedAt: string;
  readonly createdAt: string;
  readonly uploadedAt: string;
  readonly tags: readonly string[];
  readonly metadata: readonly string[];
  readonly source: {
    readonly type: string;
    readonly uri: string;
  };
  readonly assets: {
    readonly iframe: string;
    readonly player: string;
    readonly hsl: string;
    readonly thumbnail: string;
  };
};
