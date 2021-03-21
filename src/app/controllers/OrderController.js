const User = require('../models/User')
const LoadProductService = require('../services/LoadProductService')

const mailer = require('../../lib/mailer')

html = (seller, product, buyer) => {
    return `
    <h2>Olá ${seller.name}</h2>
    <p>Um pedido de compra do seu produto foi solicitado!</p>
    <p>${product.name}</p>
    <p>${product.formatedPrice}</p>
    <p><br><br></p>
    <h3>Dados do comprador</h3>
    <p>${buyer.name}</p>
    <p>${buyer.email}</p>
    <p>${buyer.address}</p>
    <p>${buyer.cep}</p>
    <p><br><br></p>
    <p><strong>Entre em contato com o comprador para finalizar a venda.</strong></p>
    <p><br><br></p>
    <p>Atenciosamente, equipe da LaunchStore</p>
    `
}

module.exports = {

    async post(req, res){

        try {

            // Dados do produto
            const product = await LoadProductService.load('product', {where: {id: req.body.id}})

            // Dados do vendedor
            const seller = await User.findOne({where: {id: product.user_id}})

            // Dados do comprador
            const buyer = await User.findOne({where: {id: req.session.userId}})

            // Enviar email com dados da compra para o vendedor
            mailer.sendMail({
                to: seller.email,
                from: "no-reply@launchstore.com",
                subject: "Pedido de compra",
                html: html(seller, product, buyer)
            })

            // Notificar o comprador com alguma mensagem de sucesso
            return res.render("orders/success")
            
        } catch (error) {
            console.error(error)
            return res.render("orders/error")
        }
    }
}