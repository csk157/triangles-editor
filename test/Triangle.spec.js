import Triangle from "../src/Triangle";

describe("Triangle", () => {
  test("Creates triangle with 3 points", () => {
    const triangle = new Triangle(
      { x: 0, y: 0 },
      { x: 5, y: 5 },
      { x: 10, y: 0 }
    );
    expect(triangle.points.length).toEqual(3);
  });

  test("Calculates the right area of the triangle", () => {
    const area = Triangle.area({ x: 0, y: 0 }, { x: 5, y: 5 }, { x: 10, y: 0 });
    expect(area).toEqual(25);
  });

  test("Determines whether point is inside triangle", () => {
    const triangle = new Triangle(
      { x: 0, y: 0 },
      { x: 5, y: 5 },
      { x: 10, y: 0 }
    );
    const pInside = { x: 5, y: 2 };
    const pOutside = { x: -5, y: 10 };
    const pOnTheLine = { x: 5, y: 5 };

    expect(triangle.isPointInside(pInside)).toEqual(true);
    expect(triangle.isPointInside(pOnTheLine)).toEqual(true);
    expect(triangle.isPointInside(pOutside)).toEqual(false);
  });

  test("Removes the fill", () => {
    const triangle = new Triangle(
      { x: 0, y: 0 },
      { x: 5, y: 5 },
      { x: 10, y: 0 }
    );
    triangle.fill = "#FF0000";
    triangle.erase();

    expect(triangle.fill).toEqual(null);
  });

  test("Determines if triangle is contained in rectangle", () => {
    const triangle = new Triangle(
      { x: 0, y: 0 },
      { x: 5, y: 5 },
      { x: 10, y: 0 }
    );
    const inRect = { x: -1, y: -1, width: 15, height: 15 };
    const outRect = { x: 5, y: 3, width: 15, height: 15 };

    expect(triangle.isContainedIn(inRect)).toEqual(true);
    expect(triangle.isContainedIn(outRect)).toEqual(false);
  });
});
