const Booking = require('../../models/booking');
const Event = require('../../models/event');
const { transformBooking, transformEvent } = require('./merge');

module.exports = {
	bookings: async (args, req) => {
		if (!req.isAuth) {
			throw new Error('Unauthenticated!');
		}
		try{
			const bookings = await Booking.find({user: req.userId});
			return bookings.map(booking => {
				return transformBooking(booking);
			});
		} catch (err){
			throw err;
		}
	},
	bookEvent: async (args, req) => {
		if (!req.isAuth) {
			throw new Error('Unauthenticated!');
		}
		try{
			const fetchedEvent = await Event.findOne({_id: args.eventId});
			const booking = new Booking({
				user: req.userId,
				event: fetchedEvent._doc._id
			});
			const result = await booking.save();
			return transformBooking(result);
		} catch (err){
			console.log(err);
			throw err;
		}
	},
	cancelBooking: async (args, req) => {
		if (!req.isAuth) {
			throw new Error('Unauthenticated!');
		}
		try{
			const booking = await Booking.findById({_id: args.bookingId}).populate('event');
			const event = transformEvent(booking.event);
			await Booking.deleteOne({_id: args.bookingId});
			return event;
		} catch (err){
			throw err;
		}
	}
};