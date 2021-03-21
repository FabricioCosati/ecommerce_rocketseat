const express = require('express')
const routes = express.Router()

const SessionController = require('../controllers/SessionController')
const UserController = require('../controllers/UserController')
const OrderController = require('../controllers/OrderController')

const UserValidator = require('../validators/user')
const SessionValidator = require('../validators/session')

const session = require('../middlewares/session')

// SESSION LOGIN / LOGOUT
routes.get("/login", session.isLoggedRedirectToLogin, SessionController.loginForm)
routes.post("/login", SessionValidator.login, SessionController.login)
routes.post("/logout", SessionController.logout)

// SESSION RESET PASSWORD / FORGOT PASSWORD
routes.get("/forgotPassword", SessionController.forgotForm)
routes.post("/forgotPassword", SessionValidator.forgot, SessionController.forgot)
routes.get("/resetPassword", SessionController.resetForm)
routes.post("/resetPassword", SessionValidator.reset, SessionController.reset)

// USERS 
routes.get("/register", session.isLoggedRedirectToLogin, UserController.create)
routes.post("/register", UserValidator.post, UserController.post)

routes.get("/", session.onlyUsers, UserValidator.show, UserController.show)
routes.put("/", session.onlyUsers, UserValidator.update, UserController.update)
routes.delete("/", session.onlyUsers, UserController.delete)

routes.get("/ads", UserController.ads)

// ORDERS
routes.post("/orders", session.onlyUsers, OrderController.post)

module.exports = routes