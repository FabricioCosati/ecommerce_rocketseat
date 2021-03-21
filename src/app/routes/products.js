const express = require('express')
const routes = express.Router()

const Products = require('../controllers/products')
const Search = require('../controllers/Search')
const ProductValidators = require('../validators/product')

const multer = require('../middlewares/multer')
const session = require('../middlewares/session')


// SEARCH
routes.get("/search", Search.index)

// PRODUCTS
routes.get("/create", session.onlyUsers, Products.create)
routes.get("/:id/edit", session.isProductOfUser, session.onlyUsers, Products.edit)
routes.get("/:id", Products.show)
routes.post("/", session.onlyUsers, multer.array("photos", 6), ProductValidators.post, Products.post)
routes.put("/", session.onlyUsers, multer.array("photos", 6), ProductValidators.put, Products.put)
routes.delete("/", session.onlyUsers, Products.delete)

module.exports = routes