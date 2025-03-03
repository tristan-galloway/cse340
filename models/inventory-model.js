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
      `SELECT inv_make, inv_model, inv_color, inv_price, inv_miles, 
              inv_description, inv_image
      FROM public.inventory
      WHERE inv_id = $1`,
      [itemId]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getInventoryItemById error: " + error);
  }
}

/* ***************************
 *  Add classification
 * ************************** */
async function addClassification(classification) {
  try {
      const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
      return await pool.query(sql, [classification]);
  } catch (error) {
      return error.message;
  }
}

/* ***************************
 *  Check if classification exists
 * ************************** */
async function checkExistingClassification(classification_name) {
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1";
    const result = await pool.query(sql, [classification_name]);
    return result.rows.length > 0; // Returns true if classification exists, false otherwise
  } catch (error) {
    console.error("Error checking classification:", error);
    return false; // Assume it doesn't exist in case of an error
  }
}

module.exports = { getClassifications, getInventoryByClassificationId, getInventoryItemById, addClassification, checkExistingClassification };