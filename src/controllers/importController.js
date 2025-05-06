// controllers/importController.js
import fs from 'fs';
import csv from 'csv-parser';
import mongoose from 'mongoose';
import Customer from '../models/customerModel.js';

export const importCustomersFromCSV = async (req, res, next) => {
    try {
        const results = [];

        fs.createReadStream('data/customers.csv')
            .pipe(csv())
            .on('data', (row) => {
                // Ensure _id is valid ObjectId if provided
                if (row._id && mongoose.Types.ObjectId.isValid(row._id)) {
                    row._id = new mongoose.Types.ObjectId(row._id);
                } else {
                    delete row._id; // Let MongoDB generate it if invalid
                }

                results.push(row);
            })
            .on('end', async () => {
                try {
                    await Customer.insertMany(results, { ordered: false });
                    res.status(200).json({ message: 'Import berhasil', count: results.length });
                } catch (err) {
                    console.error('Insert Error:', err);
                    res.status(500).json({ message: 'Gagal import', error: err.message });
                }
            });
    } catch (err) {
        next(err);
    }
};
