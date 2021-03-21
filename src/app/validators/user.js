
const User = require('../models/User')
const {compare} = require('bcryptjs')

function checkFields(body){

    const keys = Object.keys(body)

    for(let key of keys){
        if(key != 'id'){
            if(body[key] == undefined || body[key] == ""){
                console.log(key)
                return {
                    user: body,
                    error: "Por favor, preencha todos os campos."
                }
            }
        }
    }
}

module.exports = {

    async post(req, res, next) {

        try {

            let {email, cpf_cnpj, password, passwordRepeat} = req.body
            
            // Verificar se todos os campos estão preenchidos
            
            const verifyFields = checkFields(req.body)
            
            if(verifyFields){
                return res.render('users/create', verifyFields)
            }
        
            // Verificar se o usuário está cadastrado no sistema
        
            cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
        
            let user = await User.findOne(
                {
                    where: { email },
                    or: { cpf_cnpj }
                }
            )
        
            if(user){
                return res.render("users/create", {
                    user: req.body,
                    error: "Usuário já cadastrado."
                })
            }
        
            // Verificar se as senhas são iguais
        
            if(password != passwordRepeat){
                return res.render("users/create", {
                    user: req.body,
                    error: "A senha e a repetição de senha estão incorretas"
                })
            }
        
            next()
            
        } catch (error) {
            console.error(error)
        }
    },

    async show(req, res, next) {
        
        try {

            const {userId} = req.session

            const user = await User.findOne({where: {id: userId}})

            if (!user) {
                return res.render('users/create', {
                    error: "Usuário não encontrado."
                })
            }

            req.user = user

            next()
            
        } catch (error) {
            console.error(error)
        }
    },

    async update(req, res, next) {

        const {id, password} = req.body

        // Pegar o usuário do banco de dados, verificando se o ID do banco é igual ao do formulário
        const user = await User.findOne({
            where: {id}
        })

        if(!user){
            return res.render("users/index", {
                user: req.body,
                error: "Algum erro aconteceu."
            })
        }

        // Verificar se os campos estão preenchidos
        
        const verifyFields = checkFields(req.body)

        if(verifyFields){
            return res.render("users/index", verifyFields)
        }

        // Verificar se o usuário colocou a senha para atualizar

        if(!password){
            return res.render("users/index", {
                user: req.body,
                error: "Digite sua senha para atualizar seu perfil."
            })
        }

        // Verificar se a senha que o usuário digitou é igual a senha do banco de dados

        const passed = await compare(password, user.password)

        if(!passed){
            return res.render("users/index", {
                user: req.body,
                error: "Senha incorreta."
            })
        }

        req.user = user

        next()
    }
}