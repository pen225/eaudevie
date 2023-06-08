const LayoutController = class {

    // Page admin
    static getLayout = (req, res) => {
        res.render("accueil")
    }
}

module.exports = LayoutController;