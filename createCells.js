function createCells(req, res, next) {
    const cellsArray = [];
  
    for (let i = 0; i < 9; i++) {
      cellsArray.push({
        value: "",
        id: i,
        clicked: false,
      });
    }
  
    req.cells = cellsArray;
    next();
  }
  
  module.exports = createCells;
  