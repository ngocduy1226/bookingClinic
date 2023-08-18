import db from '../models/index';

let getHomePage = async (req,res) => {
    //return res.send('hello controller');
    try {
        let data = await db.User.findAll();
        // console.log('-------------------------------------')
        // console.log(data);
        // console.log('-------------------------------------')
        return res.render('homePage.ejs', {
            data: JSON.stringify(data)
        });
    }
    catch(err){
        console.log(err);
    }


}

let getUser =  (req, res) => {
    return res.render('user/login.ejs');
}

module.exports = {
    getHomePage: getHomePage,
    getUser: getUser,
}