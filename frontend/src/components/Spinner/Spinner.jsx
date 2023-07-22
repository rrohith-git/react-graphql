import React from 'react';
import classes from './Spinner.module.css'

const Spinner = () => {
    return (
        <div className={classes.spinner}>
            <div className={classes["lds-dual-ring"]}></div>
        </div>)
}

export default Spinner
