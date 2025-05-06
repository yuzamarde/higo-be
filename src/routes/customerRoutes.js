import express from 'express';
import { filterAndSearchCustomers, getAllCustomers, getAllGendersCount, getCustomerFieldCounts, searchCustomersByName } from '../controllers/customerController.js';
import { importCustomersFromCSV } from '../controllers/importController.js';

const customerRoutes = express.Router();

// Route to get all customers with pagination
customerRoutes.get('/customers', getAllCustomers);

customerRoutes.post('/import', importCustomersFromCSV);

customerRoutes.get('/customers/search', searchCustomersByName);

customerRoutes.get('/customers/count-genders', getAllGendersCount); // ← ini route baru

customerRoutes.get('/customers/field-counts', getCustomerFieldCounts);

customerRoutes.get('/customers/search-filter', filterAndSearchCustomers);

export default customerRoutes;
