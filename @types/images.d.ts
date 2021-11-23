/**
 * This file is a copy of `next/image-types/global.d.ts`, excluding `svg` declaration.
 * https://github.com/vercel/next.js/blob/917a9acc2cd8e16a7915d0b99d2ad398ede15d65/packages/next/image-types/global.d.ts#L17-L26
 *
 * More info: https://duncanleung.com/next-js-typescript-svg-any-module-declaration/
 */

// <reference types="next/image-types/global" />

interface StaticImageData {
  src: string;
  height: number;
  width: number;
  blurDataURL?: string;
}

declare module '*.png' {
  const content: StaticImageData;

  export default content;
}

declare module '*.jpg' {
  const content: StaticImageData;

  export default content;
}

declare module '*.jpeg' {
  const content: StaticImageData;

  export default content;
}

declare module '*.gif' {
  const content: StaticImageData;

  export default content;
}

declare module '*.webp' {
  const content: StaticImageData;

  export default content;
}

declare module '*.avif' {
  const content: StaticImageData;

  export default content;
}

declare module '*.ico' {
  const content: StaticImageData;

  export default content;
}

declare module '*.bmp' {
  const content: StaticImageData;

  export default content;
}
