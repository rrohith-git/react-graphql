import React from 'react';
import classes from './Modal.module.css';

const Modal = (props) => {
    return (
        <div className={classes.modal}>
            <header className={classes['modal__header']}>
                <h1>
                    {props.title}
                </h1>
            </header>
            <section className={classes['modal__content']}>
                {props.children}
            </section>
            <section className={classes['modal__actions']}>
                {props.canCancel && <button onClick={props.onCancel}>Cancel</button>}
                {props.canConfirm && <button onClick={props.onConfirm}>{props.confirmText || 'Confirm'}</button>}
            </section>
        </div>
    )
}

export default Modal
