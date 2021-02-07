const userService = require('../service/userService');
module.exports = basicAuth;

async function basicAuth(req, res, next) {
    // make authenticate path public
    console.log(req.path)
    if (req.path === '/api/register' || req.path === '/api/authentication') {
        return next();
    }

    // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    // verify auth credentials
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    console.log("credentials", credentials);
    const [username, password] = credentials.split(':');
    const user = await userService.authenticate( username, password );
    if (!user) {
        return res.status(401).json({ message: 'Invalid Authentication Credentials' });
    }

    // attach user to request object
    req.user = user

    next();
}