const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invCont = {};

/* ***************************
 *  Build inventory item view (with error handling)
 * ************************** */
invCont.buildItemView = utilities.handleErrors(async function (req, res, next) {
  const itemId = req.params.itemId;
  const data = await invModel.getInventoryItemById(itemId);

  if (!data) {
    // Handle case when the vehicle is not found
    return res.status(404).render("errors/error", {
      title: "Item Not Found",
      message: "The vehicle you're looking for does not exist.",
    });
  }

  let nav = await utilities.getNav();
  let vehicleHtml = await utilities.buildVehicleDetailView(data);

  res.render("./inventory/detail", {
    title: `${data.inv_make} ${data.inv_model}`,
    nav,
    vehicleHtml,
  });
});

/* ***************************
 *  Build inventory by classification view (with error handling)
 * ************************** */
invCont.buildByClassificationId = utilities.handleErrors(async function (req, res, next) {
  const classificationId = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classificationId);

  if (!data || data.length === 0) {
    // Handle case when no vehicles are found for the classification
    return res.status(404).render("errors/error", {
      title: "No Vehicles Found",
      message: "No vehicles found in this classification.",
    });
  }

  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;

  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
});

module.exports = invCont;