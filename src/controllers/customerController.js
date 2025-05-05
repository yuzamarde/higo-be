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

// Fetch a customer by ID
export const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.json(customer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getCustomersByName = async (req, res) => {
    try {
        const { name } = req.query;  // Get the `name` query parameter from the request

        if (!name) {
            return res.status(400).json({ message: 'Name query parameter is required' });
        }

        // Use regular expression to find names that start with the input `name` (case insensitive)
        const customers = await Customer.find({
            Name: { $regex: `^${name}`, $options: 'i' }  // ^ ensures it starts with the provided name
        });

        if (customers.length === 0) {
            return res.status(404).json({ message: 'No customers found with that name' });
        }

        res.json(customers);  // Return matching customers
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};