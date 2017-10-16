class Triangle {
  constructor(p1, p2, p3) {
    this.points = [p1, p2, p3];
    this.fillColor = null;
    this.alpha = 1;
  }

  static area(p1, p2, p3) {
    return Math.abs(
      (p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y)) / 2.0
    );
  }

  get fill() {
    return this.fillColor;
  }

  set fill(val) {
    this.fillColor = val;
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
    return a === a1 + a2 + a3;
  }

  erase() {
    this.fill = null;
    this.alpha = 1;
  }

  isContainedIn(rect) {
    return this.points.reduce((memo, p) => {
      return (
        memo &&
        !(
          p.x < rect.x ||
          p.y < rect.y ||
          p.x > rect.x + rect.width ||
          p.y > rect.y + rect.height
        )
      );
    }, true);
  }

  isIntersectingWith(rect) {
    const topLeft = { x: rect.x, y: rect.y };
    const topRight = { x: rect.x + rect.width, y: rect.y };
    const bottomLeft = { x: rect.x, y: rect.y + rect.height };
    const bottomRight = { x: rect.x + rect.width, y: rect.y + rect.height };

    const pointInsideRect = this.points.some(p => {
      return (
        p.x >= topLeft.x &&
        p.x <= bottomRight.x &&
        p.y >= topLeft.y &&
        p.y <= bottomRight.y
      );
    });

    return (
      pointInsideRect ||
      this.isPointInside(topLeft) ||
      this.isPointInside(topRight) ||
      this.isPointInside(bottomLeft) ||
      this.isPointInside(bottomRight)
    );
  }
}

export default Triangle;
