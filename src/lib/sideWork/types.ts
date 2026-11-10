/** One side work photo as stored (public.side_work). */
export type SideWorkRow = {
  id: string;
  image_path: string;
  width: number | null;
  height: number | null;
  description: string;
  created_at: string;
};

/** A side work photo as the ticker shows it. */
export type SideWorkPhoto = {
  id: string;
  src: string;
  /** The description, used as alt text (never shown on the page). */
  alt: string;
  width: number | null;
  height: number | null;
};
