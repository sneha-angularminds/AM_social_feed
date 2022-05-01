const multer = require('multer');
// const upload = multer({dest: 'uploads/'});

const storage = multer.diskStorage({
    destination: 'uploads/',
    // destination: function(req, file, cb) {
    //   cb(null, './uploads/');
    // },
    // filename: function(req, file, cb) {
    //   cb(null, new Date().toISOString() + file.originalname);
    // }
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
      }
  });
  
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  const upload = multer({
    storage: storage,
    // limits: {
    //   fileSize: 1024 * 1024 * 5
    // },
    fileFilter: fileFilter
  });

module.exports = upload
