/**
 * Geometry utilities for polygon-based map interactions.
 */

export interface Point {
  x: number;
  y: number;
}

/**
 * Ray-casting algorithm to determine if a point is inside a polygon.
 * All coordinates are in percentages (0-100).
 */
export function isPointInPolygon(point: Point, polygon: Point[]): boolean {
  let inside = false;
  const { x, y } = point;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;

    const intersect = ((yi > y) !== (yj > y))
      && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

    if (intersect) inside = !inside;
  }

  return inside;
}

/**
 * Get the bounding box of a polygon.
 */
export function getPolygonBounds(polygon: Point[]): {
  minX: number; minY: number; maxX: number; maxY: number;
  width: number; height: number; centerX: number; centerY: number;
} {
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;

  for (const p of polygon) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }

  return {
    minX, minY, maxX, maxY,
    width: maxX - minX,
    height: maxY - minY,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2,
  };
}

/**
 * Distribute N points evenly inside a polygon.
 * Returns an array of {x, y} percentage coordinates.
 */
export function distributePointsInPolygon(
  polygon: Point[],
  count: number,
  padding: number = 3  // percentage padding from edges
): Point[] {
  if (count === 0) return [];

  const bounds = getPolygonBounds(polygon);
  const points: Point[] = [];

  // Try a grid approach — compute grid dimensions
  const cols = Math.ceil(Math.sqrt(count * (bounds.width / bounds.height)));
  const rows = Math.ceil(count / cols);

  const stepX = (bounds.width - padding * 2) / (cols + 1);
  const stepY = (bounds.height - padding * 2) / (rows + 1);

  // Generate candidate points inside the polygon
  const candidates: Point[] = [];

  for (let r = 1; r <= rows + 2; r++) {
    for (let c = 1; c <= cols + 2; c++) {
      const candidate: Point = {
        x: bounds.minX + padding + c * stepX,
        y: bounds.minY + padding + r * stepY,
      };

      if (isPointInPolygon(candidate, polygon)) {
        candidates.push(candidate);
      }
    }
  }

  // If we have enough candidates, pick evenly spaced ones
  if (candidates.length >= count) {
    const step = candidates.length / count;
    for (let i = 0; i < count; i++) {
      points.push(candidates[Math.floor(i * step)]);
    }
  } else {
    // Fallback: use all candidates and fill remaining at centroid
    points.push(...candidates);
    while (points.length < count) {
      points.push({
        x: bounds.centerX + (Math.random() - 0.5) * 4,
        y: bounds.centerY + (Math.random() - 0.5) * 4,
      });
    }
  }

  return points;
}

/**
 * Convert a polygon points array to an SVG polygon points string.
 * Coordinates are in percentages — caller must scale appropriately.
 */
export function polygonToSvgPoints(polygon: Point[]): string {
  return polygon.map(p => `${p.x},${p.y}`).join(' ');
}
