const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = `<ul>
    <li><a href="/" title="Home page">Home</a></li>
    ${data.rows.map(row => `
      <li>
        <a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">
          ${row.classification_name}
        </a>
      </li>
    `).join('')}
  </ul>`;
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  if (data.length > 0) {
    return `<ul id="inv-display">
      ${data.map(vehicle => `
        <li>
          <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
            <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
          </a>
          <div class="namePrice">
            <hr />
            <h2>
              <a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                ${vehicle.inv_make} ${vehicle.inv_model}
              </a>
            </h2>
            <span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
          </div>
        </li>
      `).join('')}
    </ul>`;
  } else {
    return '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
};

/* ***************************
 *  Build the vehicle detail view HTML
 * ************************** */
Util.buildVehicleDetailView = async function (vehicle) {
  return `
    <div class="vehicle-detail">
      <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
      <h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2>
      <ul>
        <li><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</li>
        <li><strong>Description:</strong> ${vehicle.inv_description}</li>
        <li><strong>Color:</strong> ${vehicle.inv_color}</li>
        <li><strong>Miles:</strong> ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} miles</li>
      </ul>
    </div>
  `;
};

/* ***************************
 *  Build the classification drop down menu
 * ************************** */
Util.getClassificationDropdown = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let selectedClass = req.body.classification_id || ''; // Get selected classification from request body or default to empty string
  
  let dropdown = `<label for="classification_id">Classification:</label>
    <select id="classification_id" name="classification_id" required>
      <option value="">Select Classification</option>
      ${data.rows.map(row => `
        <option value="${row.classification_id}" ${selectedClass === row.classification_id ? 'selected' : ''}>${row.classification_name}</option>
      `).join('')}
    </select>`;
  return dropdown;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util