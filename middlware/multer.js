const multer = require('multer');


const uploadUserImage = multer({storage : multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1])
    }
  })

})

// const uploadUserImage = multer(multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, "public");
//     },
//     filename: (req, file, cb) => {
//       const ext = file.mimetype.split("/")[1];
//       cb(null, `uploadImage/admin-${file.fieldname}-${Date.now()}.${ext}`);
//     },
//   }))

module.exports = {uploadUserImage};