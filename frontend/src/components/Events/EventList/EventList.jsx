import React from 'react';
import classes from './EventList.module.css';
import EventItem from '../EventItem/EventItem';

const EventList = ({ events }) => {
    return (
        <ul className={classes['events__list']}>
            {events.map((event) => (<EventItem key={event._id} event={event} />))}
        </ul>
    )
}

export default EventList
