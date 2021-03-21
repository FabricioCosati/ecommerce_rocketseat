const {format} = require('date-fns')

module.exports = { 
    fns_date(timestamp){
        const createdAt = format(new Date(timestamp), 'dd/MM/yyyy')

        return {
            createdAt
        }
    },

    date(timestamp){
        const date = new Date(timestamp)

        const year = date.getFullYear()
        const month = `0${date.getMonth() + 1}`.slice(-2)
        const day = `0${date.getDate()}`.slice(-2)
        const hour = date.getHours()
        const minutes = `0${date.getMinutes()}`.slice(-2)

        return {
            hour,
            minutes,
            day,
            month,
            fullDate: `${year}-${month}-${day}`,
            birthDay: `${day}/${month}`
        }
    },

    formatPrice(price){
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price/100)
    },

    formatCpfCnpj(value){

        if(value.length > 14){
            value = value.slice(0, -1)
        }

        if(value.length > 11){
            //CNPJ
            // 11222333444455
            value = value.replace(/(\d{2})(\d)/, "$1.$2")
            // 11.222333444455
            value = value.replace(/(\d{3})(\d)/, "$1.$2")
            // 11.222.333444455
            value = value.replace(/(\d{3})(\d)/, "$1/$2")
            // 11.222.333/444455
            value = value.replace(/(\d{4})(\d)/, "$1-$2")
            // 11.222.333/4444-55
        }
        else{
            //CPF
            //11122233344
            value = value.replace(/(\d{3})(\d)/, "$1.$2")
            //111.22233344
            value = value.replace(/(\d{3})(\d)/, "$1.$2")
            //111.222.33344
            value = value.replace(/(\d{3})(\d)/, "$1-$2")
            //111.222.333-44
        }

        return value
    },

    formatCep(value){
        
        if(value.length > 8){
            value = value.slice(0, -1)
        }

        //CEP
        //11111222
        value = value.replace(/(\d{5})(\d)/, "$1-$2")
        //11111-222

        return value
    }
}




