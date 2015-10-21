import _ from 'underscore';
import { Point, Path } from 'paper';
class Triangle {
  constructor(p1, p2, p3) {
    this.points = [p1, p2, p3];
    this.shape = null;
  }
  static area(p1, p2, p3) {
    return Math.abs((p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y)) / 2.0);
  }
  isPointInside(p) {
    const pA = this.points[0];
    const pB = this.points[1];
    const pC = this.points[2];

    // Calculate area of triangle ABC
    const a = Triangle.area(pA, pB, pC);

    // Calculate area of triangle PBC
    const a1 = Triangle.area(p, pB, pC);

    // Calculate area of triangle PAC
    const a2 = Triangle.area(pA, p, pC);

    // Calculate area of triangle PAB
    const a3 = Triangle.area(pA, pB, p);

    // Check if sum of A1, A2 and A3 is same as A
    return (a === a1 + a2 + a3);
  }
  erase() {
    if (this.shape) {
      this.shape.remove();
      this.shape = null;
    }
  }
  fill(color) {
    this.erase();
    this.shape = new Path({
      segments: [
        new Point(this.points[0].x, this.points[0].y),
        new Point(this.points[1].x, this.points[1].y),
        new Point(this.points[2].x, this.points[2].y),
        new Point(this.points[0].x, this.points[0].y),
      ],
      fillColor: color,
      strokeColor: color,
      strokeWidth: 1,
    });
  }
  isContainedIn(rect) {
    return _.reduce(this.points, (memo, p) => {
      return memo && !(p.x < rect.x || p.y < rect.y || p.x > rect.x + rect.width || p.y > rect.y + rect.height);
    }, true);
  }
}

export default Triangle;
