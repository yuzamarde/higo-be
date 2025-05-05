import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true },
    location: { type: String, required: true },
    // Add other fields as needed
});

// Export the model using ES Modules syntax
const Customer = mongoose.model('Customer', customerSchema);
export default Customer;
