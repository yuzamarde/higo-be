import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    number: Number,
    nameOfLocation: String,
    date: String,
    loginHour: String,
    name: { type: String, required: true },
    age: Number,
    gender: { type: String, required: true },
    email: { type: String, required: true },
    noTelp: String,
    brandDevice: String,
    digitalInterest: String,
    location: { type: String, required: true }, // mapped from 'Location Type'
});

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;
