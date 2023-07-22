const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('./merge');
const { dateToString } = require('../../helpers/date')

module.exports = {
    events: () => {
        return Event.find({}).then(events => {
            return events.map(event => transformEvent(event));
        }).catch(err => {
            throw err
        });
    },
    createEvent: async ({ eventInput }, req) => {
        try {
            if(!req.isAuth){
                throw new Error('Unauthenticated!');
            }
            const event = new Event({
                ...eventInput,
                date: dateToString(eventInput.date),
                createdBy: req.userId
            });
            const result = await event.save();
            const user = await User.findById(req.userId);
            user.createdEvents.push(result);
            await user.save();
            return transformEvent(result);
        } catch (err) {
            throw err
        }
    }
}
