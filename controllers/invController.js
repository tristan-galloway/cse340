const invModel = require("../models/inventory-model")
const { validationResult } = require("express-validator");
const utilities = require("../utilities/");
const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;

    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (err) {
    next(err);
  }
}

/* ***************************
 *  Build inventory item view
 * ************************** */
invCont.buildItemView = async function (req, res, next) {
  try {
    const itemId = req.params.itemId;
    const data = await invModel.getInventoryItemById(itemId);
    let nav = await utilities.getNav();
    let vehicleHtml = await utilities.buildVehicleDetailView(data);

    res.render("./inventory/detail", {
      title: `${data.inv_make} ${data.inv_model}`,
      nav,
      vehicleHtml
    });
  } catch (err) {
    next(err);
  }
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();

    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
    });
  } catch (err) {
    next(err);
  }
}

/* ***************************
 *  Build add class view
 * ************************** */
invCont.buildAddClassificationView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();

    res.render("./inventory/addClass", {
      title: "Add New Classification",
      nav,
    });
  } catch (err) {
    next(err);
  }
}

/* ****************************************
 *  Add Classification
 * *************************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;

  if (!classification_name) {
    req.flash("notice", "Please provide a classification name.");
    return res.status(400).render("inventory/addClass", {
      title: "Add Classification",
      nav,
    });
  }

  try {
    const addResult = await invModel.addClassification(classification_name);
    
    if (addResult) {
      req.flash("notice", `Classification '${classification_name}' added successfully.`);
      res.status(201).redirect("/inv");
    } else {
      req.flash("notice", "Sorry, adding classification failed.");
      res.status(500).render("inventory/addClass", {
        title: "Add Classification",
        nav,
      });
    }
  } catch (error) {
    console.error("Error adding classification:", error);
    req.flash("notice", "An error occurred while adding the classification.");
    res.status(500).render("inventory/addClass", {
      title: "Add Classification",
      nav,
    });
  }
}

/* ***************************
 *  Build add vehicle view
 * ************************** */
invCont.buildAddVehicleView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    let dropdown = await utilities.getClassificationDropdown(req);  // Pass the request to the dropdown function

    res.render("./inventory/addVehicle", {
      title: "Add New Vehicle",
      nav,
      dropdown,
      classification_id: req.body.classification_id || '',  // Default to empty string if undefined
    });
  } catch (err) {
    next(err);
  }
}

/* ****************************************
 *  Add Vehicle
 * *************************************** */
invCont.addVehicle = async function (req, res) {
  let nav = await utilities.getNav();
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

  // Validate form inputs using the rules defined above
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).render("inventory/addVehicle", {
          title: "Add Vehicle",
          nav,
          dropdown: await utilities.getClassificationDropdown(req),
          errors: errors.array(),
          inv_make, 
          inv_model, 
          inv_description, 
          inv_image, 
          inv_thumbnail, 
          inv_price, 
          inv_year, 
          inv_miles, 
          inv_color,
          classification_id  // Preserve input values
      });
  }

  try {
      // Call the model to add the vehicle to the inventory
      const addResult = await invModel.addVehicle({
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
      });

      if (addResult) {
          req.flash("notice", `Vehicle '${inv_make} ${inv_model}' added successfully.`);
          res.status(201).redirect("/inv");
      } else {
          req.flash("notice", "Sorry, adding the vehicle failed.");
          res.status(500).render("inventory/addVehicle", {
              title: "Add Vehicle",
              nav,
              dropdown: await utilities.getClassificationDropdown(req),
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
          });
      }
  } catch (error) {
      console.error("Error adding vehicle:", error);
      req.flash("notice", "An error occurred while adding the vehicle.");
      res.status(500).render("inventory/addVehicle", {
          title: "Add Vehicle",
          nav,
          dropdown: await utilities.getClassificationDropdown(req),
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
      });
  }
}

module.exports = invCont