const Product = require('../models/Product')
const LoadProductService = require('../services/LoadProductService')

module.exports = {
    async index(req, res){

        try {

            let params = {}

            let {filter, category, page, limit} = req.query

            /* page = page || 1
            limit = limit || 6

            let offset = limit * (page - 1) */

            if(!filter || filter.toLowerCase() == "toda a loja"){
                filter = null
            }
            
            /* params.limit = limit
            params.offset = offset */
            
            let products = await Product.search({
                filter,
                category
            })

            products = products.map(LoadProductService.format)

            products = await Promise.all(products)

            const categories = products.map(product => ({
                total: products.length,
                id: product.category_id,
                name: product.category_name
            })).reduce((categoriesFiltered, category) => {

                const found = categoriesFiltered.some(cat => cat.id == category.id)

                if(!found){
                    categoriesFiltered.push(category)
                }
                return categoriesFiltered
            }, [])

            // QUERY POR NAME + DESCRIPTION
           /*  let allProducts = []

            products.forEach(product => {
                if(product.category_id == params.category){
                    allProducts.push(product)
                }
            })

            if(!category){
                allProducts = products
            }*/

            // PAGINATION
            let total = 0

            const search = {
                term: filter || "Toda a loja",
                total: 0
            }

            if(products.length != 0){
                search.total = products.length

                /* total = Math.ceil((+products[0].total) / limit) */
            }

            /* params.total = total
            params.page = page */

            return res.render("search/index", {products, search, categories, params})
            
        } catch (error) {
            console.error(error)
        }
    }
}