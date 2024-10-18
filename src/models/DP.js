import mongoose from 'mongoose';

const DPSchema = new mongoose.Schema({
    DLNumber: { type: String, required: true },
    DLProof: { type: String, required: false },
    RCNumber: { type: String, required: true },
    RCProof: { type: String, required: false },
    hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'Host', required: true }, // Reference to the Host
});

// Optional: You can also add hooks like hashing any sensitive data if required.

// Export the DP model
const DP = mongoose.model('DP', DPSchema);
export default DP;
