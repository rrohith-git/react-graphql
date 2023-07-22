import React, { useContext, useState } from 'react';
import classes from './EventItem.module.css';
import authContext from '../../../context/auth-context'
import Backdrop from '../../Backdrop/Backdrop';
import Modal from '../../Modal/Modal';

const EventItem = ({ event }) => {

    const authCtx = useContext(authContext);
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [isBooking, setIsBooking] = useState(false);

    const onVeiwDetailHandler = () => {
        setShowDetailModal(true);
    }

    const onBookingHandler = () => {
        if (!authCtx.token) {
            return
        }
        setIsBooking(true);
        const requestBody = {
            query: `
                    mutation bookEvent($id: ID!) {
                          bookEvent(eventId: $id) {
                            _id
                            createdAt
                            updatedAt
                            event {
                                _id
                            }
                          }
                  }
                `,
            variables: {
                id: event._id
            }
        };
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authCtx.token}`
            },
        }).then(response => {
            if (response.status !== 200 && response.status !== 201) {
                throw new Error('Failed!');
            }
            setShowDetailModal(false);
            return response.json();
        }).then(result => {
            return result
        }).catch(err => {
            console.log(err)
        }).finally(() => {
            setIsBooking(false);
        });
    }

    return (
        <>
            {showDetailModal && <>
                <Backdrop />
                <Modal
                    title={event.title}
                    onCancel={() => setShowDetailModal(false)}
                    canCancel
                    {...(authCtx.token) && { 'canConfirm': true }}
                    onConfirm={onBookingHandler}
                    confirmText={isBooking ? 'Booking...' : 'Book'}
                >
                    <h1>{event.title}</h1>
                    <h2>${event.price} - {new Date(event.date).toLocaleDateString()} - {new Date(event.date).toLocaleTimeString()}</h2>
                    <p>{event.description}</p>
                </Modal>
            </>}
            <li key={event._id} className={classes['events__list_item']}>
                <div>
                    <h1>{event.title}</h1>
                    <h2>${event.price} - {new Date(event.date).toLocaleDateString()} - {new Date(event.date).toLocaleTimeString()}</h2>
                </div>
                <div>
                    {(authCtx.userId === event.createdBy._id) ?
                        <p>Your the owner of the event</p> :
                        <button className='btn' onClick={onVeiwDetailHandler}>View Details</button>
                    }
                </div>
            </li>
        </>
    );
}

export default EventItem
