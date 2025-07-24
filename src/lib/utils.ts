import { clsx, type ClassValue } from "clsx";
import { Area } from "react-easy-crop";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// utility for SWR
export async function fetcher(...args: Parameters<typeof fetch>) {
  return await (await fetch(...args)).json();
}

export function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));

    image.src = url;
  });
}

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation: number = 0, // Add rotation parameter
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  // Calculate safe area to prevent clipping during rotation
  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  // Set canvas dimensions to accommodate rotation
  canvas.width = safeArea;
  canvas.height = safeArea;

  // Translate context to center and apply rotation
  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-safeArea / 2, -safeArea / 2);

  // Draw rotated image centered in safe area
  ctx.drawImage(
    image,
    safeArea / 2 - image.width / 2,
    safeArea / 2 - image.height / 2,
  );

  // Get rotated image data
  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  // Set final crop dimensions
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Paste rotated image with correct crop position
  ctx.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width / 2 - pixelCrop.x),
    Math.round(0 - safeArea / 2 + image.height / 2 - pixelCrop.y),
  );

  return canvas.toDataURL("image/png");
}
