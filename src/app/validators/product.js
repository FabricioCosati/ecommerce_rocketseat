
const Product = require('../models/Product')

function checkFields(body){

    const keys = Object.keys(body)

    for(let key of keys){
        if(key != "id" && key != "removed_files"){
            if(body[key] == undefined || body[key] == ""){
                return {
                    product: body,
                    error: "Por favor, preencha todos os campos."
                }
            }
        }
    }
}

module.exports = {

    async post(req, res, next){

        try {

            const verifyFields = checkFields(req.body)

            if(verifyFields){
                return res.render("products/create", verifyFields)
            }

            if(!req.files || req.files.length == 0){
                return res.render("products/create", {
                    product: req.body,
                    error: "Por favor, adicione pelo menos uma imagem."
                })
            }

            next()
            
        } catch (error) {
            console.error(error)
        }
        
    },

    async put(req, res, next){

        try {

            // Verificar se todos os campos estão preenchidos
            const verifyFields = checkFields(req.body)

            if(verifyFields){
                return res.render("products/edit", verifyFields)
            }

            next()
            
        } catch (error) {
            console.error(error)
        }

    }

}