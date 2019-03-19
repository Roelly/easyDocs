module.exports = async (req,res,next) => {

    const token = req.header('x-auth-token');
    if(!token) 
        return res.status(401).send('You are not authorized for this operation.');
    console.log("token: " + token);
    next();
}