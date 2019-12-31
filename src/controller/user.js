const loginCheck = (username, password) => {
	// 先试用假数据
	if (username === 'zs' && password === '123') {
		return true
	}
	return false;
}


module.exports = {
	loginCheck
}