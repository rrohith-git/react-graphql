const Booking = require('../../models/booking');
const { getEventById, transfromBooking, transformEvent } = require('./merge');

module.exports = {
    bookings: async (args, req) => {
        try {
            if (!req.isAuth) {
                throw new Error('Unauthenticated!');
            }
            const bookings = await Booking.find({ user: req.userId });
            return bookings.map(booking => transfromBooking(booking));
        } catch (err) {
            throw err;
        }
    },
    bookEvent: async ({ eventId }, req) => {
        try {
            if (!req.isAuth) {
                throw new Error('Unauthenticated!');
            }
            const event = await getEventById(eventId);
            if (!event) {
                throw new Error('Event doesn\'t exist');
            }
            const booking = new Booking({
                user: req.userId,
                event
            });
            const result = await booking.save();
            return transfromBooking(result);
        } catch (err) {
            throw err;
        }
    },
    cancelBooking: async ({ bookingId }, req) => {
        try {
            if (!req.isAuth) {
                throw new Error('Unauthenticated!');
            }
            const booking = await Booking.findById(bookingId).populate('event');
            const event = transformEvent(booking.event);
            await Booking.deleteOne({ _id: bookingId });
            return event;
        } catch (err) {
            throw err;
        }
    }
}