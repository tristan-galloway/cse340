const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get vehicle details by inventory ID, including the classification type
 * ************************** */
async function getInventoryItemById(itemId) {
  try {
    const data = await pool.query(
      `SELECT i.inv_make, i.inv_model, i.inv_color, i.inv_price, i.inv_miles, 
              i.inv_description, i.inv_image, c.classification_name
       FROM public.inventory AS i
       JOIN public.classification AS c 
       ON i.classification_id = c.classification_id
       WHERE i.inv_id = $1`,  // Using inv_id to fetch the vehicle
      [itemId]
    );
    return data.rows[0];  // Return the first row (since inv_id is unique)
  } catch (error) {
    console.error("getInventoryItemById error: " + error);
  }
}

module.exports = { getClassifications, getInventoryByClassificationId, getInventoryItemById };