import React from 'react';
import Cell from 'Components/Cell';

import './style.css';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // values: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
      values: [[0, 2, 0, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 2, 0, 0]]
      // values: [[0, 2, 4, 8], [16, 32, 64, 128], [256, 512, 1024, 2048], [4096, 0, 0, 0]]
    };
  }
  getFreeCells = () =>
    this.state.values.reduce((aggregator, row, rowIndex) => {
      row.forEach((el, elementIndex) => {
        if (el === 0) {
          aggregator.push([rowIndex, elementIndex]);
        }
      });

      return aggregator;
    }, []);

  getBusyCells = () =>
    this.state.values.reduce((aggregator, row, rowIndex) => {
      row.forEach((el, elementIndex) => {
        if (el !== 0) {
          aggregator.push([rowIndex, elementIndex]);
        }
      });

      return aggregator;
    }, []);

  getBusyCellsInRow = rowIndex =>
    this.getBusyCells().filter(el => el[0] === rowIndex);

  getBusyCellsInColumn = (columnIndex) => 
    this.getBusyCells().filter(el => el[1] === columnIndex);

  updateValues = (counter, cb) => {
    const freeCells = this.getFreeCells();

    this.setState(prevState => {
      while (counter > 0) {
        const index = parseInt((Math.random() * 100) % freeCells.length);
        const [rowIndex, columnIndex] = freeCells[index];

        prevState.values[rowIndex][columnIndex] = 2;

        counter--;
      }
      return prevState;
    }, cb);
  };

  getCellsAtLeft = (rowIndex, columnIndex) =>
    this.state.values[rowIndex]
      .map((el, columnIndex) => [rowIndex, columnIndex])
      .filter((_, index) => index < columnIndex)
      .sort((el1, el2) => el1 < el2);

  getCellsAtRight = (rowIndex, columnIndex) =>
    this.state.values[rowIndex]
      .map((el, columnIndex) => [rowIndex, columnIndex])
      .filter((_, index) => index > columnIndex)
      .sort((el1, el2) => el1 > el2);

  getCellsAtTop = (rowIndex, columnIndex) =>
    this.state.values
      .filter((_, index) => index < rowIndex)
      .map((_, rowIndex) => [rowIndex, columnIndex])
      .sort((el1, el2) => el1 < el2);

  getCellsAtBottom = (rowIndex, columnIndex) => {
    return this.state.values
      .map((_, rowIndex) => [rowIndex, columnIndex])
      .filter((el) => el[0] > rowIndex)
      .sort((el1, el2) => el1 > el2);
  }

  moveCellToLeft = (rowIndex, columnIndex) => {
    const busyLeftCellsInRow = this.getBusyCellsInRow(rowIndex).filter(
      cell => cell[1] < columnIndex
    );
    const cellsAtLeft = this.getCellsAtLeft(rowIndex, columnIndex);

    let row = this.state.values[rowIndex];
    cellsAtLeft.forEach(cell => {
      const rowIndex = cell[0];
      const columnIndex = cell[1];

      if (
        busyLeftCellsInRow.filter(el => el[0] === cell[0] && el[1] === cell[1])
          .length !== 0
      ) {
        if (
          row[cell[1]] ===
          row[cell[1] + 1]
        ) {
          // Merge
          row[cell[1]] *= 2;
          row[cell[1] + 1] = 0;
        }
        return;
      }

      var tmp = row[cell[1] + 1];
      row[cell[1] + 1] = row[cell[1]];
      row[cell[1]] = tmp;
    });

    this.setState(prevState => {
      prevState.values[rowIndex] = row;
      return prevState;
    });
  };

  moveCellToRight = (rowIndex, columnIndex) => {
    const busyRightCellsInRow = this.getBusyCellsInRow(rowIndex).filter(
      cell => cell[1] > columnIndex
    );
    const cellsAtRight = this.getCellsAtRight(rowIndex, columnIndex);

    let row = this.state.values[rowIndex];
    cellsAtRight.forEach(cell => {
      const rowIndex = cell[0];
      const columnIndex = cell[1];

      if (
        busyRightCellsInRow.filter(el => el[0] === cell[0] && el[1] === cell[1])
          .length !== 0
      ) {
        if (
          row[cell[1]] ===
          row[cell[1] - 1]
        ) {
          // Merge
          row[cell[1]] *= 2;
          row[cell[1] - 1] = 0;
        }
        return;
      }

      var tmp = row[cell[1] - 1];
      row[cell[1] - 1] = row[cell[1]];
      row[cell[1]] = tmp;
    });

    this.setState(prevState => {
      prevState.values[rowIndex] = row;
      return prevState;
    });
  };

  moveCellToTop = (rowIndex, columnIndex) => {
    const busyTopCellsInColumn = this.getBusyCellsInColumn(columnIndex).filter(
      cell => cell[0] < rowIndex
    );

    const cellsAtTop = this.getCellsAtTop(rowIndex, columnIndex);

    let column = this.state.values.map(row => row[columnIndex]);
    cellsAtTop.forEach(cell => {
      const rowIndex = cell[0];
      const columnIndex = cell[1];

      if (
        busyTopCellsInColumn.filter(el => el[0] === cell[0] && el[1] === cell[1])
          .length !== 0
      ) {
        if (
          column[cell[0]] ===
          column[cell[0] + 1]
        ) {
          // Merge
          column[cell[0]] *= 2;
          column[cell[0] + 1] = 0;
        }

        return;
      }

      var tmp = column[cell[0] + 1];
      column[cell[0] + 1] = column[cell[0]];
      column[cell[0]] = tmp;
    });

    this.setState(prevState => {
      prevState.values.forEach((row, rowIndex) => {row[columnIndex] = column[rowIndex]})
      return prevState;
    });
  }

  moveCellToBottom = (rowIndex, columnIndex) => {
    const busyBottomCellsInColumn = this.getBusyCellsInColumn(columnIndex).filter(
      cell => cell[0] > rowIndex
    );

    const cellsAtBottom = this.getCellsAtBottom(rowIndex, columnIndex);

    let column = this.state.values.map(row => row[columnIndex]);
    cellsAtBottom.forEach(cell => {
      const rowIndex = cell[0];
      const columnIndex = cell[1];

      if (
        busyBottomCellsInColumn.filter(el => el[0] === cell[0] && el[1] === cell[1])
          .length !== 0
      ) {
        if (
          column[cell[0]] ===
          column[cell[0] - 1]
        ) {
          // Merge
          console.log('merge')
          column[cell[0]] *= 2;
          column[cell[0] - 1] = 0;
        }

        return;
      }

      var tmp = column[cell[0] - 1];
      column[cell[0] - 1] = column[cell[0]];
      column[cell[0]] = tmp;
      console.log("column after: ", column)
    });

    this.setState(prevState => {
      prevState.values.forEach((row, rowIndex) => {row[columnIndex] = column[rowIndex]})
      return prevState;
    });
  }

  moveLeft = () => {
    console.log('Moving Left');
    const busyCells = this.getBusyCells()
      .filter(cell => cell[1] !== 0)
      .sort((cell1, cell2) => cell1[1] > cell2[1]);

    busyCells.forEach(cell => this.moveCellToLeft(cell[0], cell[1]));
  };


  moveRight = () => {
    console.log('Moving Right');
    const busyCells = this.getBusyCells()
      .filter(cell => cell[1] !== 3)
      .sort((cell1, cell2) => cell1[1] < cell2[1]);

    busyCells.forEach(cell => this.moveCellToRight(cell[0], cell[1]));
  };

  moveUp = () => {
    console.log('Moving Up');
    const busyCells = this.getBusyCells()
      .filter(cell => cell[0] !== 0)
      .sort((cell1, cell2) => cell1[0] > cell2[0]);

    busyCells.forEach(cell => this.moveCellToTop(cell[0], cell[1]));
  }

  moveDown = () => {
    console.log('Moving Down');
    const busyCells = this.getBusyCells()
      .filter(cell => cell[0] !== 3)
      .sort((cell1, cell2) => cell1[0] < cell2[0]);

    busyCells.forEach(cell => this.moveCellToBottom(cell[0], cell[1]));
  }


  componentWillMount() {
    setTimeout(this.moveDown, 500);
  }

  render() {
    return (
      <div>
        <div className="board">
          {this.state.values.map(row =>
            row.map(value => <Cell value={value} />)
          )}
        </div>
      </div>
    );
  }
}

export default Board;
