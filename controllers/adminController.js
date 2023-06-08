const AdminController = class {

    // Page admin
    static getAdminPage = (req, res) => {
        res.render("admin/index")
    }
}

module.exports = AdminController;