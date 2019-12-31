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

    // 在处理路由之前， 首先解决post请求Data
    getPostData(req).then(postData => {
        req.body = postData;
        // 处理blog路由
        const blogResult = handleBlogRouter(req, res);
        if (blogResult) {
            blogResult.then(blogData => {
                res.end(
                    JSON.stringify(
                        blogData,
                    )
                )
            })
            return;
        }
        // 处理user
        const userData = handlerUserRouter(req, res);
        if (userData) {
            res.end(JSON.stringify(userData))
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