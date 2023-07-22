import React from 'react';
import classes from './BookingControl.module.css';

const BookingControl = ({ onOutputChange, activeOutputType }) => {
  return (
    <div className={classes['bookings__control']}>
      <button
        className={activeOutputType === 'list' ? classes.active : ''}
        onClick={() => onOutputChange('list')}>
        List
      </button>
      <button
        className={activeOutputType === 'chart' ? classes.active : ''}
        onClick={() => onOutputChange('chart')}>
        Chart
      </button>
    </div>
  );
}

export default BookingControl;
