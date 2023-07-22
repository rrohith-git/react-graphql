import React, { useState, useRef, useContext } from 'react';
import { useSubmit, useActionData, useLoaderData, useNavigation } from 'react-router-dom';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import EventList from '../components/Events/EventList/EventList';
import Spinner from '../components/Spinner/Spinner';
import classes from './Events.module.css';
import authContext from '../context/auth-context';

const Events = () => {

  const { events = [] } = useLoaderData();
  const { state } = useNavigation();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const authCtx = useContext(authContext);
  const submit = useSubmit();
  const titleRef = useRef();
  const priceRef = useRef();
  const dateRef = useRef();
  const descriptionRef = useRef();
  const actionData = useActionData();
  const { errors = null } = actionData ? actionData : {};

  const onCreateEventHandler = () => {
    setShowCreateModal(true);
  }

  const onCancelHandler = () => {
    setShowCreateModal(false);
  }

  const onConfirmHandler = () => {
    const event = {
      title: titleRef.current.value,
      price: Number(priceRef.current.value),
      date: dateRef.current.value,
      description: descriptionRef.current.value,
    }
    submit({ event, token: authCtx.token }, { action: '/events', method: 'POST', encType: 'application/json' });
    setShowCreateModal(false);
  }

  return (
    <>
      {authCtx.token && <div className={classes['events-control']}>
        <p>Share your own events!</p>
        <button className={classes.btn} onClick={onCreateEventHandler}>Create Event</button>
      </div>}
      {(state === 'loading' || state === 'submitting')
        ? <Spinner />
        : (events && events.length > 0) && <EventList events={events} />
      }
      {showCreateModal && <>
        <Backdrop />
        <Modal
          title='Add Event'
          onCancel={onCancelHandler}
          onConfirm={onConfirmHandler}
          canConfirm canCancel
        >
          <form>
            <div className={classes['form-control']}>
              <div className={`${classes['form-control']} ${(errors && errors['title']) && classes['invalid']}`}>
                <label htmlFor='title'>Title</label>
                <input type='text' id='title' name='title' ref={titleRef} />
                {(errors && errors['title']) && <p>{errors['title'].message}</p>}
              </div>
              <div className={`${classes['form-control']} ${(errors && errors['price']) && classes['invalid']}`}>
                <label htmlFor='price'>Price</label>
                <input id='price' name='price' type='number' defaultValue={0} ref={priceRef} />
                {(errors && errors['price']) && <p>{errors['price'].message}</p>}
              </div>
              <div className={`${classes['form-control']} ${(errors && errors['date']) && classes['invalid']}`}>
                <label htmlFor='date'>Date</label>
                <input id='date' name='date' type='datetime-local' ref={dateRef} />
                {(errors && errors['date']) && <p>{errors['date'].message}</p>}
              </div>
              <div className={`${classes['form-control']} ${(errors && errors['description']) && classes['invalid']}`}>
                <label htmlFor='description'>Description</label>
                <textarea id='description' name='description' rows={4} ref={descriptionRef} />
                {(errors && errors['description']) && <p>{errors['description'].message}</p>}
              </div>
            </div>
            {
              (errors && Object.keys(errors).length > 0) &&
              <ul className={classes['form-errors']}>
                {Object.keys(errors).map(key =>
                  ((!['title', 'description', 'date', 'price'].includes(key)) && <li key={key}>{errors[key].message}</li>)
                )}
              </ul>
            }
          </form>
        </Modal>
      </>}
    </>
  )
}

export default Events;

export async function action({ request, params, context }) {
  const errors = {}
  try {
    const { event, token } = await request.json();
    if (event.title.trim().length === 0 || event.description.trim().length === 0 || event.date.trim().length === 0) {
      if (event.title.trim().length === 0) {
        errors['title'] = {
          field: 'title',
          message: 'Title is required'
        }
      }
      if (event.description.trim().length === 0) {
        errors['description'] = {
          field: 'description',
          message: 'Description is required'
        }
      }
      if (event.date.trim().length === 0) {
        errors['date'] = {
          field: 'date',
          message: 'Date is required'
        }
      }
      return { errors }
    }
    const requestBody = {
      query: `
            mutation createEvent($title: String!, $price: Float!, $description: String!, $date: String!){
                  createEvent(eventInput: { title: $title, price: $price, description: $description, date: $date }) {
                    _id
                    title
                    description
                    date
                    price
                    createdBy { 
                      _id
                      email
                    }
                  }
          }
        `,
      variables: {
        title: event.title,
        price: event.price,
        description: event.description,
        date: event.date
      }
    };
    const response = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
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

export const loader = async () => {
  const errors = {}
  try {
    const requestBody = {
      query: `
            query {
                  events {
                    _id
                    title
                    description
                    date
                    price
                    createdBy { 
                      _id
                      email
                    }
                  }
          }
        `
    };
    const response = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      },
    });
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
