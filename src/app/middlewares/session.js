const Product = require('../models/Product')

module.exports = {
    onlyUsers(req, res, next) {

        try {

            if(!req.session.userId){
                return res.redirect('/users/login')
            }

            next()
            
        } catch (error) {
            console.error(error)
        }
    },

    async isProductOfUser(req, res, next) {

        try {

            const product = await Product.find(req.params.id)
            
            if(product.user_id != req.session.userId){
                return res.redirect(`/products/${product.id}`)
            }

            next()
            
        } catch (error) {
            console.error(error)
        }
    },

    isLoggedRedirectToLogin(req, res, next) {

        try {
            
            if(req.session.userId){
                return res.redirect('/users')
            }

            next()

        } catch (error) {
            console.error(error)
        }
    }
}