const db = require('../../config/db')

const Base = require('../models/Base')
Base.init({table: 'files'})

const fs = require('fs')

module.exports = {
    ...Base

    /* async delete(id){
        
        try {
            
            const results = await db.query('SELECT path FROM files WHERE id = $1', [id])

            fs.unlinkSync(results.rows[0].path)
            return db.query(`DELETE FROM files WHERE id = $1`, [id])
            
        } catch (error) {
            console.error(error)
        }
    } */
}