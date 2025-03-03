/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const session = require("express-session")
const pool = require('./database/')
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const inventoryRoute = require("./routes/inventoryRoute")
const static = require("./routes/static")
const utilities = require("./utilities")
const app = express()
const baseController = require("./controllers/baseController")
const bodyParser = require("body-parser")

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))
// Inventory routes
app.use("/inv", inventoryRoute)
// account route
app.use("/account", require("./routes/accountRoute"))
// Route to trigger a 500 error
app.get("/trigger-error", utilities.handleErrors(async (req, res, next) => {
  // Simulate an error
  const err = new Error("This is a custom 500 error");
  err.status = 500;
  next(err);  // Pass the error to the error handler
}));
// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  // Get the navigation (assuming it's a shared element in all views)
  let nav = await utilities.getNav();

  // Check if the error has a specific status code (e.g., 404)
  let message;
  if (err.status === 404) {
    message = 'Page Not Found';
  } else if (err.status === 500) {
    message = 'Oh no! Something went wrong on our side. Please try again later.';
  } else {
    message = 'An unexpected error occurred on our end, try again later.';
    // Log the error to the console for debugging purposes
    console.error(`Error at: "${req.originalUrl}": ${err.message}`);
    // err.message + err.status ||
  }

  // Render the error page with relevant information
  res.status(err.status || 500).render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on: \x1b[34mhttp://${host}:${port}\x1b[0m`);
})