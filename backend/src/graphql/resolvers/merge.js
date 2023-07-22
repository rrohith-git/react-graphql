const Dataloader = require('dataloader');
const User = require('../../models/user');
const Event = require('../../models/event');
const { dateToString } = require('../../helpers/date');

const eventLoader = new Dataloader((eventIds) => {
    return getEvents(eventIds);
});

const userLoader = new Dataloader((userIds) => {
    return User.find({ _id: { $in: userIds } });
})

const getEvents = async (eventIds) => {
    return Event.find({ _id: { $in: eventIds } })
        .then(events => {
            events.sort((a, b) => {
                return (eventIds.indexOf(a._id.toString())) -(eventIds.indexOf(a._id.toString()));
            });
            return events.map(event => transformEvent(event));
        }).catch(err => {
            throw err;
        })
}

const getEventById = async (eventId) => {
    try {
        const event = await eventLoader.load(eventId.toString());
        return event;
    } catch (err) {
        throw err;
    }
}

const getUserById = (userId) => {
    return userLoader.load(userId.toString())
        .then(user => {
            return {
                ...user._doc,
                createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
            };
        }).catch(err => {
            throw err
        });
}

const transformEvent = (event) => {
    return {
        ...event._doc,
        date: dateToString(event._doc.date),
        createdBy: getUserById.bind(this, event._doc.createdBy)
    }
}

const transfromBooking = booking => {
    return {
        ...booking._doc,
        user: getUserById.bind(this, booking._doc.user),
        event: () => eventLoader.load(booking._doc.event.toString()),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    }
}

module.exports = {
    getEventById,
    transformEvent,
    transfromBooking
}