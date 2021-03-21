const db = require('../../config/db');

const Base = require('../models/Base')
Base.init({table: 'products'})

module.exports = {
    ...Base,

    //ALL: ORDER BY updated_at DESC LIMIT $1 OFFSET $2

    async files(id){

        try {
            
            const results = await db.query('SELECT * FROM files WHERE product_id = $1',[id])
            return results.rows

        } catch (error) {
            console.error(error)
        }
    },

    async search(params){

        try {

            const {filter, category} = params

            let query = `
                    SELECT products.*,
                    categories.name AS category_name
                    FROM products
                    LEFT JOIN categories ON (categories.id = products.category_id)
                    WHERE 1 = 1
                `

            if(category){
                query += `
                    AND products.category_id = ${category}
                `
            }

            if(filter){
                query += `
                    AND (products.name ilike '%${filter}%'
                    OR products.description ilike '%${filter}%')
                `
            }

            query += `
                AND status != 0
            `

            const results = await db.query(query)
            return results.rows

            /* let query = "",
                queryFilter = "WHERE"

            if(category){
                queryFilter = `
                ${queryFilter} 
                products.category_id = ${category}
                AND
                `
            }

            queryFilter = `
            ${queryFilter}
            products.name ILIKE '%${filter}%'
            `

            // QUERY DE COUNT(*)
            let total_query = `(
                SELECT count(*) 
                FROM products
                ${queryFilter}
            ) AS total`

            query = `
            SELECT products.*, 
            ${total_query},
            categories.name AS category_name
            FROM products
            LEFT JOIN categories ON (categories.id = products.category_id)
            ${queryFilter}
            ORDER BY products.id, categories.name
            LIMIT $1 OFFSET $2
            ` */
            
        } catch (error) {
            console.error(error)
        }
    }
} 