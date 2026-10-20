export interface Point {
  lat: number;
  lng: number;
}

/** Straight-line distance in miles between two coordinates (haversine formula). */
export function distanceMiles(a: Point, b: Point) {
  const R = 3958.8;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** The `count` places closest to `from`, nearest first, never including `from` itself. */
export function nearest<T extends Point & { slug: string }>(from: T, all: T[], count: number) {
  return all
    .filter((place) => place.slug !== from.slug)
    .map((place) => ({ place, miles: distanceMiles(from, place) }))
    .sort((a, b) => a.miles - b.miles)
    .slice(0, count);
}
