const cron = require('node-cron');
const db = require("./models");
const Booking = db.booking;
const User = db.user;
const { Op } = require("sequelize");
const { sendNotificationToSubscriptionName } = require("./controllers/subscription.controller");
const { sendNotificationToUserId } = require('../controllers/subscription.controller');

cron.schedule('* * * * *', async () => {
    try {
        const now = new Date();
        const fifteenMinutesLater = new Date(now.getTime() + 15 * 60000);


        const bookings = await Booking.findAll({
            where: {
                checkOut: {
                    [Op.between]: [now, fifteenMinutesLater],
                },
                state: 'pending',
            },
            include: [
                {
                    model: User,
                    attributes: ['id'],
                },
            ],
        });

        for (const booking of bookings) {
            const userId = booking.user.id;
            const title = `Recuerda recoger tu reserva en 15 minutos.`;
            const description = `Tu reserva está casi lista. Por favor, retira los objetos a tiempo.`;
            
            await sendNotificationToUserId(userId, title, description);
        }
    } catch (error) {
        console.error('Error en el trabajo programado:', error);
    }
});