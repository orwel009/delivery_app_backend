import express from "express";
import Order from "../models/Orders.js";

const router = express.Router();

router.use(express.json());

router.post('/add-order', async (req, res) => {
    console.log(req.body);

    try {
        const { pickup, dropoff, size, vehicle, handleWithCare, hostId } = req.body;

        const newOrder = new Order({ pickup, dropoff, size, vehicle, handleWithCare, hostId });
        await newOrder.save();

        res.status(200).json({ message: 'Order submitted successfully!' });
    } catch (error) {
        console.error("Error submitting order:", error);
        res.status(500).json({ error: 'Failed to submit order.' });
    }
});

router.post('/my-orders', async (req, res) => {
    const { hostId } = req.query;


    try {
        const orders = await Order.find({ hostId });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Failed to fetch orders.', error: error.message });
    }
});

router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params; // Extracting id from the URL parameters
    try {
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) {
            return res.status(404).json({ error: 'Order not found.' });
        }
        res.status(200).json({ message: 'Order deleted successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete order.' });
    }
});

router.post('/active-orders', async (req, res) => {
    try {
        const activeOrders = await Order.find({ active: true }).populate('hostId', 'name');

        res.status(200).json(activeOrders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch active orders.' });
    }
});

router.put('/:id/inactivate', async (req, res) => {
    try {
        const orderId = req.params.id;
        const { userName } = req.body;
        console.log(userName)

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { active: false, takenBy: userName },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order marked as inactive', order: updatedOrder });
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark order as inactive.' });
    }
});

router.post('/order-details', async (req, res) => {
    const { userName } = req.query;
    try {
        const orders = await Order.find({ takenBy: userName }).populate('hostId','name');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders taken by user.' });
    }
});


export default router;
