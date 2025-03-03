const invModel = require("../models/inventory-model")
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
    let dropdown = await utilities.getClassificationDropdown()

    res.render("./inventory/addVehicle", {
      title: "Add New Vehicle",
      nav,
      dropdown,
    });
  } catch (err) {
    next(err);
  }
}


module.exports = invCont