const User = require("../models/user")

module.exports.renderSignup=(req, res) => {
    res.render("users/signup.ejs")
}
;
module.exports.signup=async (req, res, next) => {
    let { username, email, password } = req.body;
    try {
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Destiny Delight");
            res.redirect("/listings");
        });
    } catch (error) {
        req.flash("error2", error.message);
        res.redirect("/signup");
    }
};

module.exports.RenderLogin= (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login=(req, res) => {
        req.flash("success", "You are logged in");
        res.redirect(res.locals.redirectUrl);
    }


module.exports.logout=(req, res, next) => {
    req.logout(err => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out");
        res.redirect("/listings");
    });
};