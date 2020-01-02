const querystring = require('querystring')
const handlerUserRouter = require('./src/router/user')
const handleBlogRouter = require('./src/router/blog');

// 用于处理postData
const getPostData = (req) => {
    return new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({})
            return;
        }
        if (req.headers["content-type"] !== 'application/json') {
            resolve({});
            return;
        }
        let postData = '';
        req.on("data", chunk => postData += chunk.toString());
        req.on("end", () => {
            if (!postData) {
                resolve({})
                return;
            }
            resolve(JSON.parse(postData))
        });
    })
}

// session数据
const SESSION_DATA = {};
const getCookieExpires = () =>{
	const d = new Date();
	d.setTime(d.getTime() + 24* 60 * 60 * 1000);
	console.log('d.toGMTString()123', d.toGMTString())
	return d.toGMTString();
}
const serverHandle = (req, res) => {
    // 设置返回格式 JSON
    res.setHeader("Content-Type", 'application/json')
    // 获取path
    const {
        path,
        url
    } = req;
    req.path = url.split('?')[0]
    // 解析query
    req.query = querystring.parse(url.split('?')[1]);
    // 获取cookie
    req.cookie = {};
    const cookieStr = req.headers.cookie || '';
    cookieStr.split(';').forEach(item => {
        if (!item) {
            return; 
        }
        const arr = item.split('=');
        const key = arr[0].trim();
        const val = arr[1].trim();
        req.cookie[key] = val;
    })

    // 解析session
    let needSetCookie = false; // 判断userId 需不需要设置cookie
    let userId = req.cookie.userid
    if (userId) {
        if (!SESSION_DATA[userId]) {
            SESSION_DATA[userId] = {};
        }
        
    } else {
        userId = `${Date.now()}_${Math.random()}`
        SESSION_DATA[userId] = {};
        needSetCookie = true;
    }
    req.session = SESSION_DATA[userId] || {};

    // 在处理路由之前， 首先解决post请求Data
    getPostData(req).then(postData => {
        req.body = postData;
        // 处理blog路由
        const blogResult = handleBlogRouter(req, res);
        if (blogResult) {
            blogResult.then(blogData => {
                if (needSetCookie) {
                    res.setHeader("Set-Cookie", `userid=${userId};path=/;httpOnly;expires=${getCookieExpires()}`)
                }
                res.end(
                    JSON.stringify(
                        blogData,
                    )
                )
            })
            return;
        }
        // 处理user
        const handleUser = handlerUserRouter(req, res);
        if (handleUser) {
            if (needSetCookie) {
                res.setHeader("Set-Cookie", `userid=${userId};path=/;httpOnly;expires=${getCookieExpires()}`)
            }
            handleUser.then(userData => {
                res.end(JSON.stringify(userData))
            })
            return;
        }

        res.writeHead(404, {
            "Content-Type": "text/plain"
        });
        res.write("404 NOT FOUND");
        res.end();
    });
}

module.exports = serverHandle