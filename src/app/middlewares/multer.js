const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/images')
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now().toString()}-${file.originalname}`)
    }
})

const fileFilter = (req, file, cb) => {
    const isAcceptable = ['image/png', 'image/jpeg', 'image/jpg'].find(image => image == file.mimetype)

    if(isAcceptable){
        cb(null, true)
    }
    else{
        cb(null, false)
    }
    
}

module.exports = multer({
    storage,
    fileFilter
})