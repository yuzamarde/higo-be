import Customer from '../models/customerModel.js';

// Fetch all customers
export const getAllCustomers = async (req, res) => {
    try {
        // Get page and limit from query parameters
        const page = parseInt(req.query.page) || 1; // Default to page 1 if no page is specified
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if no limit is specified

        // Calculate the number of documents to skip
        const skip = (page - 1) * limit;

        // Fetch customers from MongoDB
        const customers = await Customer.find().skip(skip).limit(limit);

        // Get the total count of customers for pagination info
        const totalCustomers = await Customer.countDocuments();

        // Return the data with pagination info
        res.json({
            total: totalCustomers,
            page,
            totalPages: Math.ceil(totalCustomers / limit),
            customers,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const searchCustomersByName = async (req, res) => {
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({ error: 'Name query parameter is required' });
        }

        const customers = await Customer.find({
            name: { $regex: name, $options: 'i' } // Case-insensitive search
        });

        return res.status(200).json({ total: customers.length, customers });
    } catch (error) {
        return res.status(500).json({ error: 'Server error', details: error.message });
    }
};

export const getAllGendersCount = async (req, res) => {
    try {
        const result = await Customer.aggregate([
            {
                $match: { gender: { $in: ['Male', 'Female'] } }
            },
            {
                $group: {
                    _id: '$gender',
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    gender: '$_id',
                    count: 1
                }
            }
        ]);

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: 'Server error', details: error.message });
    }
};


export const getCustomerFieldCounts = async (req, res) => {
    try {
        const fields = ['gender', 'digitalInterest', 'brandDevice', 'location', 'nameOfLocation'];

        const pipeline = fields.map((field) => ([
            {
                $group: {
                    _id: `$${field}`,
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    key: '$_id',
                    count: 1
                }
            },
            {
                $sort: { count: -1 }
            }
        ])).flatMap((stage, i) => ([
            { $facet: { [fields[i]]: [stage[0], stage[1], stage[2]] } }
        ]));

        // Since $facet must be in one stage
        const result = await Customer.aggregate([
            {
                $facet: {
                    gender: [
                        { $group: { _id: "$gender", count: { $sum: 1 } } },
                        { $project: { _id: 0, key: "$_id", count: 1 } },
                        { $sort: { count: -1 } }
                    ],
                    digitalInterest: [
                        { $group: { _id: "$digitalInterest", count: { $sum: 1 } } },
                        { $project: { _id: 0, key: "$_id", count: 1 } },
                        { $sort: { count: -1 } }
                    ],
                    brandDevice: [
                        { $group: { _id: "$brandDevice", count: { $sum: 1 } } },
                        { $project: { _id: 0, key: "$_id", count: 1 } },
                        { $sort: { count: -1 } }
                    ],
                    location: [
                        { $group: { _id: "$location", count: { $sum: 1 } } },
                        { $project: { _id: 0, key: "$_id", count: 1 } },
                        { $sort: { count: -1 } }
                    ],
                    nameOfLocation: [
                        { $group: { _id: "$nameOfLocation", count: { $sum: 1 } } },
                        { $project: { _id: 0, key: "$_id", count: 1 } },
                        { $sort: { count: -1 } }
                    ]
                }
            }
        ]);

        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};


export const filterAndSearchCustomers = async (req, res) => {
    try {
        const {
            name,
            digitalInterest,
            brandDevice,
            location,
            nameOfLocation,
            gender,
            page = 1,
            limit = 10
        } = req.query;

        const filter = {};

        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }
        if (digitalInterest) filter.digitalInterest = digitalInterest;
        if (brandDevice) filter.brandDevice = brandDevice;
        if (location) filter.location = location;
        if (nameOfLocation) filter.nameOfLocation = nameOfLocation;
        if (gender) filter.gender = gender;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [total, customers] = await Promise.all([
            Customer.countDocuments(filter),
            Customer.find(filter)
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ date: -1 }) // optional: sort by date descending
        ]);

        return res.status(200).json({
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            customers
        });
    } catch (error) {
        return res.status(500).json({ error: 'Server error', details: error.message });
    }
};
