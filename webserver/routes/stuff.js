const express = require('express');

const router = express.Router();
const stuffCtrl = require('../controllers/stuff');

/*------------------------------------*/
/*----------------JOBS----------------*/
/*------------------------------------*/
router.get('/jobs', stuffCtrl.getJobs);
router.post('/jobs/add', stuffCtrl.addJob);
router.put('/jobs/update', stuffCtrl.updateJob);
router.post('/jobs/delete', stuffCtrl.deleteJob);

/*------------------------------------*/
/*-------------DEPARTMENTS------------*/
/*------------------------------------*/
router.get('/departments', stuffCtrl.getDepartments);

/*------------------------------------*/
/*--------------EMPLOYEES-------------*/
/*------------------------------------*/
router.get('/employees', stuffCtrl.getEmployees);
router.post('/employees/add', stuffCtrl.addEmployee);
router.put('/employees/update', stuffCtrl.updateEmployee);
router.post('/employees/delete', stuffCtrl.deleteEmployee);

/*------------------------------------*/
/*--------------ACCOUNTS--------------*/
/*------------------------------------*/
router.post('/accounts/isvalid', stuffCtrl.isValidAccount);

module.exports = router;