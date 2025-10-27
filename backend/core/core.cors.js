/**
 * Slantapp code and properties {www.slantapp.io}
 */

//add user, custom core controller here - blacklist and whitelist ip here
const CoreController = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}
export default CoreController;
