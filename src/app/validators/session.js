const User = require('../models/User')
const {compare} = require('bcryptjs')

module.exports = {
    async login(req, res, next) {
        
        try {

            const {email, password} = req.body

            // Verificar se o usuário está cadastrado
            const user = await User.findOne({
                where: {email}
            })

            if(!user){
                return res.render('session/login', {
                    user: req.body,
                    error: "Usuário não cadastrado."
                })
            }

            // Verificar se as senhas conferem
            const passed = await compare(password, user.password)

            if(!passed){
                return res.render('session/login', {
                    user: req.body,
                    error: "Senha incorreta."
                })
            }

            // Colocar usuário no req.session
            req.user = user

            next()
            
        } catch (error) {
            console.error(error)
        }
    },

    async forgot(req, res, next) {

        try {

            const {email} = req.body

            const user = await User.findOne({
                where: {email}
            })

            if(!user){
                return res.render('session/forgot-password', {
                    user: req.body,
                    error: "Email não cadastrado."
                })
            }

            req.user = user

            next()
            
        } catch (error) {
            console.error(error)
            return res.render('session/forgot-password', {
                user: req.body,
                error: "Erro inesperado."
            })
        }
    },

    async reset(req, res, next) {

        try {

            const {email, password, passwordRepeat, token} = req.body

            // Procurar Usuário
            const user = await User.findOne({
                where: {email}
            })

            if(!user){
                return res.render('session/reset-password', {
                    user: req.body,
                    token,
                    error: "Email não cadastrado."
                })
            }

            // Verificar se as senhas conferem
            if(password != passwordRepeat){
                return res.render('session/reset-password', {
                    user: req.body,
                    token,
                    error: "As senhas não são iguais."
                })
            }

            // Verificar se o token confere
            if(token != user.reset_token){
                return res.render('session/reset-password', {
                    user: req.body,
                    token,
                    error: "Token inválido! Solicite uma nova recuperação de senha."
                })
            }

            // Verificar se o token não expirou

            let tokenExpires = new Date()
            tokenExpires = tokenExpires.setHours(tokenExpires.getHours())

            if(tokenExpires > user.reset_token_expires){
                return res.render('session/reset-password', {
                    user: req.body,
                    token,
                    error: "O token expirou! Solicite uma nova recuperação de senha."
                })
            }

            req.user = user

            next()
            
        } catch (error) {
            console.error(error)
            return res.render('session/reset-password', {
                user: req.body,
                token,
                error: "Erro inesperado, tente novamente."
            })
        }
    }
}