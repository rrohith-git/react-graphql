import React, { useState } from 'react';
import { useLoaderData, useNavigation } from 'react-router-dom'
import Spinner from '../components/Spinner/Spinner';
import BookingList from '../components/Bookings/BookingList';
import BookingChart from '../components/Bookings/BookingChart';
import BookingControl from '../components/Bookings/BookingControl';

const Bookings = () => {

  const { bookings = [] } = useLoaderData();
  const { state } = useNavigation();
  const [outputType, setOutputType] = useState('list');

  const changeOutputTypeHandler = (outputType) => {
    if (outputType === 'list') {
      setOutputType('list');
    } else {
      setOutputType('chart');
    }
  }

  let content = <Spinner />;

  if (state !== 'loading') {
    content = (
      <React.Fragment>
        <BookingControl onOutputChange={changeOutputTypeHandler } activeOutputType={outputType}/>
        <div>
          {outputType === 'list' && <BookingList bookings={bookings} />}
          {outputType === 'chart' && <BookingChart bookings={bookings} />}
        </div>
      </React.Fragment>
    );
  }

  return content;
}

export default Bookings


export const loader = async () => {
  const errors = {}
  try {
    const requestBody = {
      query: `
            query {
                  bookings {
                    _id
                    createdAt
                    event {
                      _id
                      title
                      date
                      price
                    }
                  }
          }
        `
    };
    const response = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
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
    errors['error'] = { message: 'Failed to get bookings' };
    return { errors };
  }
}