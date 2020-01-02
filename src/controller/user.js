const {exec} = require('../db/mysql')
const login = (username, password) => {
	// 先试用假数据
	const sql = `select username, realname from users where username='${username}' and
	 password=${password}`

	return exec(sql).then(rows => {
		// 返回第一行的数据
		return rows[0] || {};
	})
}



module.exports = {
	login
}