// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require('../utilities')
const invController = require("../controllers/invController")
const validateManagement = require("../utilities/management-validation"); 

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// Route to get details for a specific vehicle
router.get("/detail/:itemId", utilities.handleErrors(invController.buildItemView));
// Route to manage the inventory
router.get("/", utilities.handleErrors(invController.buildManagementView));
// Route to add a classification
router.get("/add/classification", utilities.handleErrors(invController.buildAddClassificationView));
// Route to add a vehicle
router.get("/add/vehicle", utilities.handleErrors(invController.buildAddVehicleView));

/* Add Classification Route */
router.post(
    "/add/classification",
    validateManagement.classRules(),
    validateManagement.checkClassData,
    utilities.handleErrors(invController.addClassification)
);

module.exports = router;