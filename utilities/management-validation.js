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

/* **********************************
 *  Vehicle Data Validation Rules
 * ********************************* */
validateManagement.vehicleRules = () => {
    return [
        body("inv_make")
            .trim()
            .notEmpty()
            .matches(/^[A-Za-z0-9\s]+$/)  // Allows alphanumeric characters and spaces
            .withMessage("Make must contain only alphanumeric characters and spaces."),
        
        body("inv_model")
            .trim()
            .notEmpty()
            .matches(/^[A-Za-z0-9\s]+$/)  // Allows alphanumeric characters and spaces
            .withMessage("Model must contain only alphanumeric characters and spaces."),
        
        body("inv_description")
            .trim()
            .notEmpty()
            .isLength({ min: 10 })  // Minimum length for description
            .withMessage("Description must be at least 10 characters long."),
        
        body("inv_image")
            .trim()
            .notEmpty()
            .matches(/^\/images\/vehicles\/[A-Za-z0-9_\-]+\.(jpg|jpeg|png|gif|bmp)$/)  // Match URLs like /images/vehicles/image.png
            .withMessage("Image path must be a valid URL starting with /images/vehicles/ and ending with a valid image extension (jpg, jpeg, png, gif, bmp)."),
        
        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .matches(/^\/images\/vehicles\/[A-Za-z0-9_\-]+\.(jpg|jpeg|png|gif|bmp)$/)  // Match URLs like /images/vehicles/image.png
            .withMessage("Thumbnail path must be a valid URL starting with /images/vehicles/ and ending with a valid image extension (jpg, jpeg, png, gif, bmp)."),
        
        body("inv_price")
            .trim()
            .notEmpty()
            .isInt({ min: 0 })  // Ensure the price is a non-negative integer
            .withMessage("Price must be a valid integer (no decimals)."),
        
        
        body("inv_year")
            .trim()
            .notEmpty()
            .isInt({ min: 1900, max: new Date().getFullYear() })  // Ensure year is between 1900 and current year
            .withMessage("Year must be a valid year between 1900 and the current year."),
        
        body("inv_miles")
            .trim()
            .notEmpty()
            .isInt({ min: 0 })  // Ensure miles is a positive integer
            .withMessage("Miles must be a positive integer."),
        
        body("inv_color")
            .trim()
            .notEmpty()
            .matches(/^[A-Za-z\s]+$/)  // Only alphabetic characters and spaces for color
            .withMessage("Color must contain only alphabetic characters and spaces."),

        // Ensure classification exists and is valid
        body("classification_id")
            .trim()
            .notEmpty()
            .custom(async (classification_id) => {
                const classificationExists = await invModel.checkExistingClassificationById(classification_id)
                if (!classificationExists) {
                    throw new Error("Invalid classification. Please select a valid classification.");
                }
            })
    ];
};

/* **********************************
 *  Check Data and Handle Errors for Vehicle
 * ********************************* */
validateManagement.checkVehicleData = async (req, res, next) => {
    const { 
        inv_make, 
        inv_model, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_year, 
        inv_miles, 
        inv_color, 
        classification_id 
    } = req.body;

    let errors = validationResult(req); // Check for validation errors

    if (!errors.isEmpty()) {
        let nav = util.getNav();
        return res.render("inventory/addVehicle", {
            errors: errors.array(), // Convert errors to an array
            title: "Add Vehicle",
            nav,
            inv_make, 
            inv_model, 
            inv_description, 
            inv_image, 
            inv_thumbnail, 
            inv_price, 
            inv_year, 
            inv_miles, 
            inv_color,
            classification_id,  // Preserve input values
            dropdown: await util.getClassificationDropdown(req) // Ensure dropdown is available
        });
    }
    next(); // If no errors, move to the next middleware
};


module.exports = validateManagement;
