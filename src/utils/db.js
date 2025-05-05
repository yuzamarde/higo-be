import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const dbUri = process.env.MONGODB_URI;
        if (!dbUri) {
            throw new Error('MongoDB URI is not defined in .env');
        }
        await mongoose.connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
