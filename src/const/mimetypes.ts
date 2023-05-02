export enum ImageMimeType {
  JPEG = "image/jpeg",
  PNG = "image/png",
  GIF = "image/gif",
  BMP = "image/bmp",
  WEBP = "image/webp",
  SVG = "image/svg+xml",
}

export const imageMimeTypes: string[] = Object.values(ImageMimeType);
