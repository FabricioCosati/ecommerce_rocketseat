const db = require("../../config/db")

function find(filters, params, table){

    let query = `SELECT * FROM ${table}`

    if(filters){
        Object.keys(filters).map(key => {
            query = `
            ${query}
            ${key}
            `

            Object.keys(filters[key]).map(field => {
                query = `
                ${query} ${field} = '${filters[key][field]}'
                `
            })
        })
    }

    if(params){
        const {limit, offset} = params

        query += `,(SELECT count(*) AS total FROM ${table}) AS total
        ORDER BY updated_at DESC LIMIT ${limit} OFFSET ${offset}
        `
    }

    return db.query(query)
}

const Base = {
    
    init({table}){

        if(!table) throw new Error("Table not found.")

        this.table = table

        return this
    },

    async find(id){

        try {

            const results = await find({where: {id}}, "", this.table)
            return results.rows[0]
            
        } catch (error) {
            console.error(error);
        }
    },

    async findOne(filters){
        try {
            
            const results = await find(filters, "", this.table)
            return results.rows[0]

        } catch (error) {
            console.error(error);
        }
    },

    async findAll(filters){

        try {
            const results = await find(filters, "", this.table)
            return results.rows
            
        } catch (error) {
            console.error(error);
        }
    },

    async findAllPaginate(filters, params){

        try {
            const results = await find(filters, params, this.table)
            return results.rows
            
        } catch (error) {
            console.error(error);
        }
    },

    async create(filters){
        
        try {

            let keys = []
                values = []

            Object.keys(filters).map(key => {
                
                keys.push(key)
                values.push(`'${filters[key]}'`)
            })

            const query = `INSERT INTO ${this.table} (${keys.join(",")}) VALUES (${values.join(",")}) RETURNING id`

            const results = await db.query(query)
            return results.rows[0].id

            
            
        } catch (error) {
            console.error(error);
        }
    },

    async update(id, filters){

        try {
            
            let update = []

            Object.keys(filters).map(key => {

                const row = `${key} = '${filters[key]}'`
                update.push(row)
            })

            const query = `UPDATE ${this.table} SET ${update.join(",")} WHERE id = $1`
            
            return db.query(query, [id])
            
        } catch (error) {
            console.error(error);
        }
    },

    delete(id){
        
        try {
            
            return db.query(`DELETE FROM ${this.table} WHERE id = $1`, [id])
            
             

        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = Base