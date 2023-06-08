const LayoutController = require("../controllers/indexController");

const router = require("express").Router();

router.get("/",LayoutController.getLayout);
// router.get('*', (req, res) => {
//     res.redirect('/')
// });


module.exports = router;
