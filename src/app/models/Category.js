const db = require('../../config/db');

const Base = require('../models/Base')
Base.init({table: 'categories'})

module.exports = {
    ...Base
}