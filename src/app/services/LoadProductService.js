const Product = require('../models/Product')

const {formatPrice, date, fns_date} = require('../../lib/utils')

async function format(product){
    const files = await getImage(product.id)
    product.img = files[0].src.replace(/\\/g,"/")
    product.files = files
    product.formatedPrice = formatPrice(product.price).replace(".",",")
    product.formatedOldPrice = formatPrice(product.old_price).replace(".",",")
    product.formatedCreatedAt = fns_date(product.created_at).createdAt

    let {day, hour, minutes, month} = date(product.updated_at)

    product.published = {
        hour: `${hour}h${minutes}`,
        day: `${day}/${month}`
    }

    return product
}

async function getImage(productId){
    let files = await Product.files(productId)
    /* console.log(files[0].path.replace("public", "").replace(/\\/g,"/")) */
    files = files.map(file => ({
        ...file,
        src: `${file.path.replace("public", "")}`
    }))
    return files
}

module.exports = {
    load(service, filter){

        try {

            this.filter = filter

            return this[service]()
            
        } catch (error) {
            console.error(error)
        }
    },

    async product(){

        try {

            const product = await Product.findOne(this.filter)

            return format(product)
            
        } catch (error) {
            console.error(error)
        }

    },

    async products(){

        try {
            let products = await Product.findAll(this.filter)

            products = products.map(format)

            return Promise.all(products)

        } catch (error) {
            console.error(error)
        }
        
    },

    async productsPaginate(params){

        try {
            
            let products = await Product.findAllPaginate("", params)

            products = products.map(format)

            return Promise.all(products)

        } catch (error) {
            console.error(error)
        }
    },

    format
}