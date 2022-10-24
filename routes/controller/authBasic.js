const isAuth = (req, res, next) => {
    if (req.sessions.isAuth) {
        next();
    } else {
        res.redirect('/login');
    }
};

const isAuthAdmin = (req, res, next) => {
    if(req.sessions.isAuth && req.session.position == "TL"){
        next();
    }else{
        res.redirect('/login');
    }
};

module.exports = {isAuth, isAuthAdmin};