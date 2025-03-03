const util = require("../utilities");
const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model"); // Import inventory model
const validateManagement = {};

/*  **********************************
  *  Classification Data Validation Rules
  * ********************************* */
validateManagement.classRules = () => {
    return [
        body("classification_name")
            .trim()
            .notEmpty()
            .matches(/^[A-Za-z]+$/) // Only alphabetic characters, no spaces
            .withMessage("Classification name must contain only alphabetic characters (no spaces).")
            .custom(async (classification_name) => {
                const classExists = await invModel.checkExistingClassification(classification_name);
                if (classExists) {
                    throw new Error("Classification already exists. Please use a different name.");
                }
            })
    ];
};

/* **********************************
 *  Check Data and Handle Errors for Class
 * ********************************* */
validateManagement.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body;
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        let nav = util.getNav();
        return res.render("inventory/addClass", {
            errors: errors.array(), // Convert errors to an array
            title: "Add Classification",
            nav,
            classification_name, // Preserve input value
        });
    }
    next();
};

module.exports = validateManagement;
