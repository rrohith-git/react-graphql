import React from 'react';
import { Bar } from 'react-chartjs-2';
import classes from './BookingChart.module.css';
// eslint-disable-next-line
import { Chart as ChartJs } from 'chart.js/auto';

const BOOKING_BUCKETS = {
    'Cheap': {
        min: 0,
        max: 100
    },
    'Normal': {
        min: 100,
        max: 200
    },
    'Expensive': {
        min: 200,
        max: 1000000000
    }
}

const BookingChart = ({ bookings }) => {
    const chartData = { labels: [], datasets: [] };
    let values = []
    for (let bucket in BOOKING_BUCKETS) {
        const filteredBookingsCount = bookings.reduce((prev, booking) => {
            if (booking.event.price > BOOKING_BUCKETS[bucket].min && booking.event.price < BOOKING_BUCKETS[bucket].max) {
                return prev + 1;
            }
            return prev;
        }, 0);
        values.push(filteredBookingsCount)
        chartData.labels.push(bucket);
        chartData.datasets.push({
            label: `${bucket} Price`,
            data: values,
            backgroundColor: [
                '#f3ba2f',
                '#2a71d0',
                '#50AF95',
            ],
            borderColor: '#333', 
            borderWidth: 2
        });
        values = [...values];
        values[values.length - 1] = 0;
    }

    return (
        <div className={classes['bookings__chart']}>
            <Bar data={chartData} />
        </div>
    );
}

export default BookingChart;
