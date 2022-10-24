const isAuth = (req, res, next) =>{
    if(req.session.isAuth){
        next();
    }else{
        res.redirect('/login');
    }

};

const isAuthAdmin = (req, res, next) =>{
    if(req.session.isAuth && req.session.accounttype == 'Administrator'){
        next();
    }else{
        res.redirect('/login');
    }
};

module.exports = {isAuth};