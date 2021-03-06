import React from 'react';
import Cell from 'components/Cell';

import './style.css';

class Board extends React.Component {
  state = {
    values: this.props.values || [
      [0, 4, 8, 4],
      [4, 8, 0, 64],
      [2, 1024, 16, 4],
      [4, 0, 1024, 2]
    ],
    // values: this.props.values || [
    //   [0, 0, 0, 0],
    //   [0, 0, 0, 0],
    //   [0, 0, 0, 0],
    //   [0, 0, 0, 0]
    // ],
    freeze: false,
    updateTime: 100
  };

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

  getBusyCellsInColumn = columnIndex =>
    this.getBusyCells().filter(el => el[1] === columnIndex);

  isGameWon = () =>
    this.state.values.some(row => Boolean(row.some(el => el === 2048)));

  isGameLost = () => {
    if (this.isGameWon() || this.getFreeCells().length !== 0) return false;

    const {values} = this.state;
    for (let i = 0; i < this.state.values.length; i++) {
      for (let j = 0; j < this.state.values.length - 1; j++) {
        // check rows
        if (values[i][j] == values[i][j + 1]) {
          return false;
        }
        // check colums
        if (values[j][i] == values[j + 1][i]) {
          return false;
        }
      }
    }

    return true;
  };

  updateValues = (counter, cb) => {
    const freeCells = this.getFreeCells();

    this.setState(
      prevState => {
        while (counter > 0) {
          if (this.getFreeCells().length == 0) {
            break;
          }
          const index = parseInt((Math.random() * 100) % freeCells.length);
          const value = [2, 4][parseInt((Math.random() * 100) % 2)];
          const [rowIndex, columnIndex] = freeCells[index];

          prevState.values[rowIndex][columnIndex] = value;

          counter--;
        }
        return prevState;
      },
      () => {
        this.props.updateValues(this.state.values);
        cb();
      }
    );
  };

  getCellsAtLeft = (rowIndex, columnIndex) =>
    this.state.values[rowIndex]
      .map((_, cIndex) => [rowIndex, cIndex])
      .filter((_, index) => index < columnIndex)
      .sort((el1, el2) => el1 < el2);

  getCellsAtRight = (rowIndex, columnIndex) =>
    this.state.values[rowIndex]
      .map((_, cIndex) => [rowIndex, cIndex])
      .filter((_, index) => index > columnIndex)
      .sort((el1, el2) => el1 > el2);

  getCellsAtTop = (rowIndex, columnIndex) =>
    this.state.values
      .filter((_, index) => index < rowIndex)
      .map((_, rIndex) => [rIndex, columnIndex])
      .sort((el1, el2) => el1 < el2);

  getCellsAtBottom = (rowIndex, columnIndex) =>
    this.state.values
      .map((_, rIndex) => [rIndex, columnIndex])
      .filter(el => el[0] > rowIndex)
      .sort((el1, el2) => el1 > el2);

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
        if (row[cell[1]] === row[cell[1] + 1]) {
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

    const values = this.state.values.map(
      (r, rIndex) => (rowIndex == rIndex ? row : r)
    );
    this.setState({values}, this.props.updateValues(this.state.values));
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
        if (row[cell[1]] === row[cell[1] - 1]) {
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

    const values = this.state.values.map(
      (r, rIndex) => (rowIndex == rIndex ? row : r)
    );
    this.setState({values}, this.props.updateValues(this.state.values));
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
        busyTopCellsInColumn.filter(
          el => el[0] === cell[0] && el[1] === cell[1]
        ).length !== 0
      ) {
        if (column[cell[0]] === column[cell[0] + 1]) {
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

    const values = this.state.values.map((row, rowIndex) => {
      row[columnIndex] = column[rowIndex];
      return row;
    });
    this.setState({values}, this.props.updateValues(this.state.values));
  };

  moveCellToBottom = (rowIndex, columnIndex) => {
    const busyBottomCellsInColumn = this.getBusyCellsInColumn(
      columnIndex
    ).filter(cell => cell[0] > rowIndex);

    const cellsAtBottom = this.getCellsAtBottom(rowIndex, columnIndex);

    let column = this.state.values.map(row => row[columnIndex]);
    cellsAtBottom.forEach(cell => {
      const rowIndex = cell[0];
      const columnIndex = cell[1];

      if (
        busyBottomCellsInColumn.filter(
          el => el[0] === cell[0] && el[1] === cell[1]
        ).length !== 0
      ) {
        if (column[cell[0]] === column[cell[0] - 1]) {
          // Merge
          console.log('merge');
          column[cell[0]] *= 2;
          column[cell[0] - 1] = 0;
        }

        return;
      }

      var tmp = column[cell[0] - 1];
      column[cell[0] - 1] = column[cell[0]];
      column[cell[0]] = tmp;
    });

    const values = this.state.values.map((row, rowIndex) => {
      row[columnIndex] = column[rowIndex];
      return row;
    });
    this.setState({values}, this.props.updateValues(this.state.values));
  };

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
  };

  moveDown = () => {
    console.log('Moving Down');
    const busyCells = this.getBusyCells()
      .filter(cell => cell[0] !== 3)
      .sort((cell1, cell2) => cell1[0] < cell2[0]);

    busyCells.forEach(cell => this.moveCellToBottom(cell[0], cell[1]));
  };

  onKeyPress = e => {
    const freeCells = this.getFreeCells();

    // Game is lost
    if (this.isGameLost()) {
      alert('Game over');
      return;
    }

    // Game is won
    if (this.isGameWon()) {
      alert('Congratulations! You won!');
      return;
    }

    if (this.state.freeze || [37, 38, 39, 40].indexOf(e.keyCode) === -1) {
      console.log('wait the values to update');
      return null;
    }

    let action = null;
    switch (e.keyCode) {
      case 38:
        // up
        action = this.moveUp;
        break;
      case 40:
        // down
        action = this.moveDown;
        break;
      case 37:
        // left
        action = this.moveLeft;
        break;
      case 39:
        // right
        action = this.moveRight;
        break;
      default:
        break;
    }
    this.setState(
      {
        freeze: true
      },
      action
    );

    setTimeout(() => {
      this.setState({freeze: false}, () => this.updateValues(2, () => null));
    }, this.state.updateTime);
  };

  componentDidMount() {
    if (this.props.enablePlaying) {
      this.props.newGame(this.state.values);
      this.updateValues(2, () => null);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.values !== this.props.values) {
      this.setState({values: nextProps.values});
    }
  }

  render() {
    const overlayStatus = this.isGameWon()
      ? 'won'
      : this.isGameLost() ? 'lost' : '';

    return (
      <div>
        {this.props.enablePlaying ? (
          <div className="board" onKeyDown={this.onKeyPress} tabIndex="0">
            <div className={'overlay ' + overlayStatus}>{overlayStatus}</div>
            {this.state.values.map(row =>
              row.map(value => <Cell value={value} />)
            )}
          </div>
        ) : (
          <div className="board">
            <div className={'overlay ' + overlayStatus}>{overlayStatus}</div>
            {this.state.values.map(row =>
              row.map(value => <Cell value={value} />)
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Board;
