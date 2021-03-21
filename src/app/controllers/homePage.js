const Product = require('../models/Product')
const LoadProductService = require('../services/LoadProductService')

const {formatPrice} = require('../../lib/utils')

module.exports = {
    async index(req, res){

        try {

            let {page, limit} = req.query
            page = page || 1
            limit = limit || 6

            offset = limit * (page - 1)

            const params = {
                limit,
                offset
            }

            let products = await LoadProductService.productsPaginate(params)

            let total = 0
            
            if(products.length == 0){
                total = 0
            }
            else{
                total = Math.ceil((+products[0].total) / limit)
            }

            params.total = total
            params.page = page

            products.filter((product, index) => limit > index ? true : false)

            return res.render("home/index", {products, params})
            
        } catch (error) {
            console.error(error)
        }
    }
}