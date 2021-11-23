/**
 * Returns the first preferred video mime type supported by the browser.
 */
export function getPreferredVideoMimeType() {
  const fileExtensions = ['webm', 'mp4'];

  // https://developer.mozilla.org/en-US/docs/Web/Media/Formats/codecs_parameter
  const codecs = [
    'vp9',
    'vp9.0',
    'vp8',
    'vp8.0',
    'avc1',
    'av1',
    'h265',
    'h.265',
    'h264',
    'h.264',
    'opus'
  ];

  for (const fileExtension of fileExtensions) {
    for (const codec of codecs) {
      /**
       * Testing different mime types variations since
       * - Firefox 94.0.1 and Safari 15.1 seem to support `codecs:` but not `codecs=`
       * - Parameter values may be case sensitive. See: https://www.rfc-editor.org/rfc/rfc2045
       */
      const mimeTypesVariations = [
        `video/${fileExtension};codecs=${codec}`,
        `video/${fileExtension};codecs:${codec}`,
        `video/${fileExtension};codecs=${codec.toUpperCase()}`,
        `video/${fileExtension};codecs:${codec.toUpperCase()}`,
        `video/${fileExtension}`
      ];
      for (const mimeTypeVariation of mimeTypesVariations) {
        if (MediaRecorder.isTypeSupported(mimeTypeVariation)) {
          return { name: mimeTypeVariation, extension: fileExtension };
        }
      }
    }
  }
}
