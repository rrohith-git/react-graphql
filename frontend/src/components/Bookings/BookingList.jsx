import React, { useEffect, useState } from 'react';
import { useSubmit, useActionData } from 'react-router-dom';
import classes from './BookingList.module.css';

const BookingList = ({ bookings }) => {

    const submit = useSubmit();
    const actionData = useActionData();
    const [isBookingCancel, setIsCancelling] = useState({
        isCancel: false,
        bookingId: null
    });

    useEffect(() => {
        if (actionData && actionData.cancelBooking._id && actionData.cancelBooking._id === isBookingCancel.bookingId) {
            setIsCancelling({
                bookingId: null,
                isCancel: false
            })
        }
    }, [actionData, isBookingCancel.bookingId])

    const onBookingCancelHandler = (bookingId) => {
        setIsCancelling({
            bookingId,
            isCancel: true
        })
        submit(bookingId, { method: 'POST', action: '/bookings', encType: 'text/plain' });
    };

    return (
        <>
            {(bookings && bookings.length > 0) ? <ul className={classes['bookings__list']}>
                {bookings.map(booking => (
                    <li
                        className={classes['bookings__item']}
                        key={booking._id}
                    >
                        <div className={classes['bookings__item_data']}>
                            {booking.event.title} - {' '}
                            {`${new Date(booking.createdAt).toLocaleDateString()} - ${new Date(booking.createdAt).toLocaleTimeString()}`}
                        </div>
                        <div>
                            <button className='btn' onClick={() => onBookingCancelHandler(booking._id)}>
                                {(booking._id === isBookingCancel.bookingId && isBookingCancel.isCancel) ? 'Cancelling...' : 'Cancel'}
                            </button>
                        </div>
                    </li>
                ))}
            </ul> : <h1 className={classes['no__bookings']}>No Bookings</h1>}
        </>
    );
};

export default BookingList

export const action = async ({ request }) => {
    const errors = {};
    try {
        const bookingId = await request.text();
        const requestBody = {
            query: `
                    mutation CancelBooking($id : ID!){
                          cancelBooking(bookingId: $id) {
                            _id
                            title 
                          }
                  }
                `,
            variables: {
                id: bookingId
            }
        };
        const response = await fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        })
        if (response.status !== 200 && response.status !== 201) {
            throw new Error('Failed!');
        }
        const result = await response.json();
        if (result.errors && result.errors.length > 0) {
            result.errors.forEach((error, index) => { errors[`${index}-${index}`] = { message: error.message } });
            return { errors };
        }
        return result.data
    } catch (err) {
        errors['error'] = { message: 'Event Creation Failed!' };
        return { errors };
    }
}
