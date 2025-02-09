const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    
    // Check if data is empty or not found
    if (!data || data.length === 0) {
      return next({ status: 404, message: 'Classification not found' });
    }

    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;

    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (err) {
    next(err); // Pass any other errors to the error handler
  }
}

/* ***************************
 *  Build inventory item view
 * ************************** */
invCont.buildItemView = async function (req, res, next) {
  try {
    const itemId = req.params.itemId;
    const data = await invModel.getInventoryItemById(itemId);

    // Check if data is empty or not found
    if (!data) {
      return next({ status: 404, message: 'Item not found' });
    }

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

module.exports = invCont