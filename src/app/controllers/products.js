const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')
const LoadProductService = require('../services/LoadProductService')

const {formatPrice, date} = require('../../lib/utils')

const {unlinkSync} = require('fs')

module.exports = {
    async create(req, res){
        try {

            const categories = await Category.findAll()

            return res.render("products/create", {categories})

        } catch (error) {
            console.error(error)
        }
    },

    async post(req, res){
        
        try {
            
            const {userId} = req.session
            req.body.user_id = userId

            let {category_id, name, description, old_price, price, quantity, status, user_id} = req.body

            price = price.replace(/\D/g, "")

            let product_id = await Product.create({
                category_id, 
                user_id,
                name, 
                description, 
                old_price: old_price || price, 
                price,
                quantity, 
                status: status || 1
            })
            
            const files = req.files.map(file => File.create(
                {
                    name: file.filename,
                    path: file.path,
                    product_id
                }
            ))
                
            await Promise.all(files)
            
            return res.redirect(`/products/${product_id}/edit`)
            
        } catch (error) {
            console.error(error)
        }
    },

    async show(req, res){
        try {

            let product = await LoadProductService.load('product', {where: {id: req.params.id}})

            return res.render("products/show", {product})
            
        } catch (error) {
            console.error(error)
        }
    },

    async edit(req, res){

        try {

            let categories = await Category.findAll()

            let product = await LoadProductService.load('product', {where: {id: req.params.id}})

            return res.render("products/edit", {product, categories})
            
        } catch (error) {
            console.error(error)
        }
    },

    async put(req, res){

        try {

            const {userId} = req.session
            req.body.user_id = userId

            let {name, description, old_price, price, quantity, status, removed_files} = req.body

            price = price.replace(/\D/g, "")
            
            if(price != old_price){
                const oldProduct = await Product.find(req.body.id)
                old_price = oldProduct.price
            }

            if(removed_files){
                const removeFiles = removed_files.split(",")
                const lastIndex = removeFiles.length - 1
                removeFiles.splice(lastIndex, 1)

                const totalFiles = await Product.files(req.body.id)

                if(totalFiles.length - removeFiles.length == 0 && req.files.length == 0){
                    return res.send("Please send at least one image.")
                }

                removeFiles.map(file => File.delete(file))
            }
            
            if(req.files.length != 0){
                const filesPromises = req.files.map(file => File.create({
                    name: file.filename,
                    path: file.path,
                    product_id: req.body.id
                }))

                await Promise.all(filesPromises)
            }

            const allFiles = await Product.files(req.body.id)

            if(!allFiles || allFiles.length == 0){
                return res.send("Please send at least one image.")
            }
            
            await Product.update(req.body.id, {
                name,
                description,
                old_price,
                price,
                quantity,
                status
            })
            
            return res.redirect(`/products/${req.body.id}`)
            
        } catch (error) {
            console.error(error)
        }
    },

    async delete(req, res){

        try {

            let files = await Product.files(req.body.id)

            await Product.delete(req.body.id)

            files.map(file => {
                try {

                    unlinkSync(file.path)
                    
                } catch (error) {
                    console.error(error)
                }
            })

            return res.redirect('/')
            
        } catch (error) {
            console.error(error)
        }
    }
}