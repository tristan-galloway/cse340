const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory item view
 * ************************** */
invCont.buildItemView = async function (req, res, next) {
  const itemId = req.params.itemId;
  const data = await invModel.getInventoryItemById(itemId);
  let nav = await utilities.getNav();
  let vehicleHtml = await utilities.buildVehicleDetailView(data);
  res.render("./inventory/detail", {
    title: `${data.inv_make} ${data.inv_model}`,
    nav,
    vehicleHtml
  });
};

module.exports = invCont