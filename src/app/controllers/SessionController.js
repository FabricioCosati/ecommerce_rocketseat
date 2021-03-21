const crypto = require('crypto')
const User = require('../models/User')
const mailer = require('../../lib/mailer')
const {hash} = require('bcryptjs')

class SessionController {

    loginForm(req, res){

        try {

            return res.render('session/login')
            
        } catch (error) {
            console.error(error)
        }
    }

    login(req, res){

        try {
            
            req.session.userId = req.user.id

            return res.redirect(`/users`)
            
        } catch (error) {
            console.error(error)
        }
    }

    async logout(req, res){
        
        try {

            if(req.session){
                req.session.destroy()
            }
            
            return res.redirect('/users/login')
            
        } catch (error) {
            console.error(error)
        }
    }

    forgotForm(req,res){

        try {

            return res.render('session/forgot-password')
            
        } catch (error) {
            console.error(error)
        }
    }

    async forgot(req, res){
        
        try {

            const {user} = req

            // Criar token para mandar ao usuário
            const token = crypto.randomBytes(20).toString("hex")

            // Criar expiração do token
            let expireToken = new Date()
            expireToken = expireToken.setHours(expireToken.getHours() + 1)

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: expireToken
            })

            // Enviar email com link de recuperação de senha
            mailer.sendMail({
                to: user.email,
                from: 'no-reply-launchstore@gmail.com',
                subject: 'Recuperação de Senha',
                html: `
                <style>
                    a {
                        background-color: #fd951f;
                        color: white;
                        padding: .8rem 1rem;
                        display: block;
                        margin: 2rem 0;
                        border-radius: .5rem;
                        width: 100%;
                        font-weight: bold;
                        text-transform: uppercase;
                        font-size: 1.5rem;
                        text-align: center;
                        cursor: pointer;
                        transition: background-color .3s;
                        align-self: end;
                        text-decoration: none;
                        max-width: 40%;
                    }

                    a:hover {
                        background-color: #da8524;
                    }

                </style>
                <h2>Olá ${user.name}, Perdeu a senha?</h2>
                <p>Não se preocupe, clique no link abaixo para redefinir sua senha!</p>
                <p>
                    <a href="http://localhost:3000/users/resetPassword?token=${token}" target="_blank">
                        REDEFINIR SENHA
                    </a>
                </p>
                `
            })

            // Avisar o usuário que foi enviado um email para a recuperação de senha
            return res.render('session/forgot-password', {
                success: "Enviamos um email para você, dê uma olhada!"
            })
            
        } catch (error) {
            console.error(error)
        }
    }

    resetForm(req, res){
        
        try {

            return res.render('session/reset-password', {token: req.query.token})
            
        } catch (error) {
            console.error(error)
        }
    }

    async reset(req, res){ 

        try {

            const {user} = req
            const {password, token} = req.body

            // Criar novo hash de senha
            const newPassword = await hash(password, 8)

            // Atualizar o usuário
            User.update(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: ""
            })

            // Avisar usuário que sua senha foi redefinida
            return res.render('session/login', {
                user: req.body,
                success: "Senha atualizada com sucesso! Faça seu login."
            })            
            
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

module.exports = new SessionController()