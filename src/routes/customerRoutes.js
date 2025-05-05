import express from 'express';
import { getAllCustomers, getCustomerById, getCustomersByName } from '../controllers/customerController.js';

const customerRoutes = express.Router();

// Route to get all customers with pagination
customerRoutes.get('/customers', getAllCustomers);

// Route to get a customer by ID
customerRoutes.get('/customers/:id', getCustomerById);

customerRoutes.get('/customers/name', getCustomersByName);

export default customerRoutes;
