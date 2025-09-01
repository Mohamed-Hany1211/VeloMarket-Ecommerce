// modules imports
import { scheduleJob } from "node-schedule";
import { DateTime } from "luxon";
// files imports
import Order from '../../../../DB/models/order.model.js';

export const cronToCancelUnpaidOrders = () => {
    // schedule a job that runs every 1 day
    scheduleJob("0 0 23 * * *", async () => {
        await Order.updateMany({orderStatus: 'Pending', createdAt: { $lt: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss') }} , {orderStatus: 'Cancelled'});
    });
}
