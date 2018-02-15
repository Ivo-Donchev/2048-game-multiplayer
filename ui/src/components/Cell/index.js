import React from 'react';
import './styles.css';

const Cell = ({value}) => {
  let cellClassName = 'cell cell-' + value;
  let valueClassName = 'value value-' + value;

  return (
    <div className={cellClassName}>
      <div className={valueClassName}>
        {value}
      </div>
    </div>
  );
};

export default Cell;
