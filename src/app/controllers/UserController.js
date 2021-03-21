const User = require('../models/User')
const Product = require('../models/Product');
const LoadProductService = require('../services/LoadProductService')

const {formatCpfCnpj, formatCep} = require('../../lib/utils')

const {hash} = require('bcryptjs')
const {unlinkSync} = require('fs')

class Controller {

    create(req, res){

        try {

            return res.render("users/create")
            
        } catch (error) {
            console.error(error)
        }
    }

    async post(req, res){

        try {

            let {name, email, password, cpf_cnpj, cep, address} = req.body

            password = await hash(password, 8)
            cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
            cep = cep.replace(/\D/g, "")
            
            const userId = await User.create({
                name,
                email,
                password,
                cpf_cnpj,
                cep,
                address
            })

            req.session.userId = userId
    
            return res.redirect(`/users`)

        } catch (error) {
            console.error(error)
        }
    }

    async show(req, res){

        try {

            const {user} = req

            user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj)
            user.cep = formatCep(user.cep)

            return res.render("users/index", {user})

        } catch (error) {
            console.error(error)
        }
    }

    async update(req, res){

        try {
            
            let {user} = req
            let {name, email, cpf_cnpj, cep, address} = req.body

            cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
            cep = cep.replace(/\D/g, "")

            await User.update(user.id, {
                name, 
                email, 
                cpf_cnpj, 
                cep, 
                address
            })

            return res.render("users/index", {
                user: req.body,
                success: "Atualizado com sucesso!"
            })
            
        } catch (error) {
            
            console.error(error)
            return res.render('users/index', {
                user: req.body,
                error: "Algum erro aconteceu."
            })
        }
    }

    async delete(req, res){

        try {

            // Pegar todos os produtos do usuário
            const products = await Product.find({where: {user_id: req.body.id}})

            /* const products = await db.query(`SELECT * FROM products WHERE user_id = $1`, [id]) */

            // Pegar todos os arquivos de CADA produto
            let allFiles = products.map(product => {
                return Product.files(product.id)
            })
            allFiles = await Promise.all(allFiles)

            // Remover o usuário do sistema
            await User.delete(req.body.id)

            // Remover as imagens da nossa aplicação (pasta public)
            allFiles.map(files => {
                files.rows.map(file => {
                    try {

                        unlinkSync(file.path)
                        
                    } catch (error) {
                        console.error(error)
                    }
                })
            })

            req.session.destroy()

            return res.render('session/login', {
                success: "Conta deletada com sucesso!"
            })
            
        } catch (error) {
            console.error(error)
            return res.render('users/index', {
                user: req.body,
                error: "Não foi possível deletar sua conta."
            })
        }
    }

    async ads(req, res){

        try {
            const products = await LoadProductService.load('products', {where: {user_id: req.session.userId}})
            
            return res.render("users/ads", {products})
            
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = new Controller()