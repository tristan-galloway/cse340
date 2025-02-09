// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to get details for a specific vehicle
router.get("/detail/:itemId", invController.buildItemView);

module.exports = router;