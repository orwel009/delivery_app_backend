import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    pickup: { type: String, required: true },
    dropoff: { type: String, required: true },
    size: { type: String, required: true },
    vehicle: { type: String, required: true },
    handleWithCare: { type: Boolean, default: false },
    hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'Host', required: true }, // Reference to the host (order creator)
    active: { type: Boolean, default: true },  // Field to indicate if the order is still active (true) or taken (false)
    takenBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Reference to the user who took the order
}, { timestamps: true });

// Define the Order model
const Order = mongoose.model('Order', OrderSchema);

export default Order;
