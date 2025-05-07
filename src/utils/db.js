import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const dbUri = process.env.MONGODB_URI;
        console.log("MONGODB_URI:", dbUri);  // ⬅️ Tambahkan ini untuk cek
        if (!dbUri) {
            throw new Error('MongoDB URI is not defined in .env');
        }
        await mongoose.connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,  // ⬅️ Tambahkan timeout
            socketTimeoutMS: 10000           // ⬅️ Tambahkan timeout
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

export default connectDB;
