class Grid {
  constructor({width, height}, unitSize) {
    this.width = width;
    this.height = height;
    this.unitSize = unitSize;
    this.values = {};
  }

  iterateCells(fn) {
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        fn({x: i, y: j});
      }
    }
  }

  getRealSize() {
    return {
      width: this.width * this.unitSize,
      height: this.height * this.unitSize,
    };
  }

  isRealPositionOutside(realCoordinates) {
    const realSize = this.getRealSize();
    return !realCoordinates
      || realSize.width <= realCoordinates.x
      || realCoordinates.x < 0
      || realSize.height <= realCoordinates.y
      || realCoordinates.y < 0;
  }

  isPositionOutside(coordinates) {
    return !coordinates
      || this.width < coordinates.x
      || coordinates.x < 0
      || this.height < coordinates.y
      || coordinates.y < 0;
  }

  getGridPosition(realCoordinates) {
    if (this.isRealPositionOutside(realCoordinates)) {
      return null;
    }

    return {
      x: Math.floor(realCoordinates.x / this.unitSize),
      y: Math.floor(realCoordinates.y / this.unitSize),
    };
  }

  setGridValue(coordinates, value) {
    if (this.isPositionOutside(coordinates)) {
      return;
    }

    this.values[`${coordinates.x}-${coordinates.y}`] = value;
  }

  getGridValue(coordinates) {
    if (this.isPositionOutside(coordinates)) {
      return null;
    }

    const res = this.values[`${coordinates.x}-${coordinates.y}`];
    return res !== undefined ? res : null;
  }

  getCellRealRectangle(coordinates) {
    if (this.isPositionOutside(coordinates)) {
      return null;
    }

    return {
      x: coordinates.x * this.unitSize,
      y: coordinates.y * this.unitSize,
      width: this.unitSize,
      height: this.unitSize,
    };
  }

  getLines() {
    if (this.width <= 0 || this.height <= 0) {
      return [];
    }

    const results = [];
    const size = this.getRealSize();

    for (let i = 1; i < this.width; i++) {
      const line = {
        from: {x: i * this.unitSize, y: 0},
        to: {x: i * this.unitSize, y: size.height},
      };

      results.push(line);
    }

    for (let i = 1; i < this.height; i++) {
      const line = {
        from: {x: 0, y: i * this.unitSize},
        to: {x: size.width, y: i * this.unitSize},
      };

      results.push(line);
    }

    // create borders
    const topLine = {
      from: {x: 0, y: 0},
      to: {x: size.width, y: 0},
    };
    const bottomLine = {
      from: {x: 0, y: size.height},
      to: {x: size.width, y: size.height},
    };
    const leftLine = {
      from: {x: 0, y: 0},
      to: {x: 0, y: size.height},
    };
    const rigthLine = {
      from: {x: size.width, y: 0},
      to: {x: size.width, y: size.height},
    };

    results.push(topLine);
    results.push(bottomLine);
    results.push(leftLine);
    results.push(rigthLine);

    return results;
  }
}

export default Grid;
