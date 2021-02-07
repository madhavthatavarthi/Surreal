const { pool } = require("../config");
const R = require("ramda")
async function authenticate(emailId, password) {
        try {
            const queryText = "Select * from userinfo where email_Id = $1 and password = $2"
            const response = await pool.query(queryText, [emailId, password])
            console.log("ressss", response);
            if (response && response.rows && R.type(response.rows) === "Array" && !R.isEmpty(response.rows)) {
                const { password, ...userWithoutPassword } = response.rows[0];
                return userWithoutPassword
            }       
            else
               return { "error": { "code": 400, "message": 'Username or password is incorrect' } }
        } catch(err) {
            console.log(err);
            reject(err);
        }    
}

module.exports = {
    authenticate
}