const express = require('express')
const routes = express.Router()

const Home = require('../controllers/homePage')

const products = require('./products')
const users = require('./users')

// HOMEPAGE
routes.get("/", Home.index)   

routes.use('/products', products)
routes.use('/users', users)

// ALIAS
routes.get("/ads/create", (req, res) => {
    return res.redirect("/products/create")
})
routes.get('/accounts', (req, res) => {
    return res.redirect("/users/login")
})

module.exports = routes