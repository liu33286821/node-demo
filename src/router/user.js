const {
	loginCheck
} = require('../controller/user')
const {
	SuccessModel,
	ErrorModel
} = require('../model/resModel')
const handleUserRouter = (req, res) => {
	const {
		method,
		url
	} = req
	const path = url.split('?')[0];
	// 登录接口
	if (method === 'POST' && path === '/api/user/login') {
		const {
			username,
			password
		} = req.body;
		const result = loginCheck(username, password);
		if (result) return new SuccessModel();
		return new ErrorModel("账户名或密码错误");
	}
}

module.exports = handleUserRouter