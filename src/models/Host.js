// models/Host.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const HostSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    dob: { type: Date, required: true },
    //idProof: { type: String, required: true },
    password: { type: String, required: true },
});

// Hash the password before saving the host
HostSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const Host = mongoose.model('Host', HostSchema);
export default Host;
