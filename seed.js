const User = require('./src/app/models/User')
const Product = require('./src/app/models/Product')
const File = require('./src/app/models/File')

const {hash} = require('bcryptjs')
const faker = require('faker')

const totalUsers = 4,
    totalProducts = 10,
    totalFiles = 50

let usersIds = [],
    productsIds = []

async function createUsers(){
    const users = []
    let password = await hash('1234', 8)

    while(users.length < totalUsers){

        users.push({
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password,
            cpf_cnpj: faker.random.number(99999999999),
            cep: faker.random.number(99999999),
            address: faker.address.streetAddress(),
        })
    }

    const usersPromises = users.map(user => User.create(user))

    usersIds = await Promise.all(usersPromises)
}

async function createProducts(){
    const products = []

    while(products.length < totalProducts){
        products.push({
            category_id: Math.ceil(Math.random() * 3),
            user_id: usersIds[Math.floor(Math.random() * totalUsers)],
            name: faker.commerce.productName(),
            description: faker.lorem.paragraph(Math.ceil(Math.random() * 10)),
            old_price: faker.random.number(9999),
            price: faker.random.number(9999),
            quantity: faker.random.number(999),
            status: Math.round(Math.random())
        })
    }

    const productsPromises = products.map(product => Product.create(product))
    productsIds = await Promise.all(productsPromises)

    const files = []

    while(files.length < totalFiles){

        files.push({
            product_id: productsIds[Math.floor(Math.random() * totalProducts)],
            name: faker.image.image(),
            path: `public/images/placeholder.png`
        })
    }

    const filesPromises = files.map(file => File.create(file))
    await Promise.all(filesPromises)

}

async function init(){
    await createUsers()
    await createProducts()
}

init()