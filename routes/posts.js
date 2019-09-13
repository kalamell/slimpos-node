const router = require('express').Router();
const verify = require('./verifyToken');
const multer = require('multer');
const gm = require('gm');
const path = require('path');
const ABSPATH = path.dirname(process.mainModule.filename);



router.get('/', [verify], async (req, res) => {
    res.status(200).json({
        result: true,
        'posts': {
            title: 'my first', 
            body: 'msggggv sss'
        }
    })
});


let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else { 
        cb(null, false);
    }
}

let upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

router.post('/upload', upload.single('file'), async (req, res) => {
    if (req.file) {
        console.log(req.file);
        gm(ABSPATH + '/' + req.file.path)
            .resize(240, 240, '!')
            .write(ABSPATH + '/' + req.file.destination + '/thumb_' + req.file.filename, function (err) {
                if (!err) console.log('done');
                if (err) {
                    console.log(err);
                }
        });

        res.json({
            result: true,
            file: req.file
        })
    } else { 
        res.json({
            result: false,
            msg: 'upload error',
        })
    }
})


module.exports = router;

