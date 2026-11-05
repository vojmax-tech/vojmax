/**
 * Each VOJMAX object's concept drawing, keyed by product slug, plus the
 * crops of it the gallery uses as placeholders. A new object adds its
 * drawing component (same props as FrameDrawing) and its crops here.
 */
import FrameDrawing from "./FrameDrawing.astro";
import BookDrawing from "./BookDrawing.astro";
import type { GallerySlot } from "../../../data/products";

export const drawings: Record<string, typeof FrameDrawing> = {
  "frame-01": FrameDrawing,
  "book-01": BookDrawing,
};

/** viewBox crops of the drawing, by gallery view. */
export const crops: Record<string, Partial<Record<GallerySlot["view"], string>>> = {
  "frame-01": {
    detail: "150 80 300 300",
    surface: "262 172 376 352",
  },
  "book-01": {
    surface: "130 130 740 460",
    detail: "540 206 300 300",
  },
};
