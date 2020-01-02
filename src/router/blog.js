const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
} = require('../controller/blog')
const {
    SuccessModel,
    ErrorModel
} = require('../model/resModel')
const handleBlogRouter = (req, res) => {
    const {
        method,
        url
    } = req
    const path = url.split('?')[0];
    const id = req.query.id;
    // 获取博客列表
    if (method === 'GET' && path === '/api/blog/list') {
        const author = req.query.author || '';
        const keyword = req.query.keyword || ''
        const result = getList(author, keyword);
        return result.then(list => {
            return new SuccessModel(list);
        })
        // const listData = getList(author, keyword);
        // return new SuccessModel(listData, "成功")
    }
    // 获取博客详情
    if (method === 'GET' && path === '/api/blog/detail') {
        return getDetail(id).then(res => {
            return new SuccessModel(res)
        });
    }

    // 新建博客
    if (method === 'POST' && path === '/api/blog/new') {
        return newBlog(req.body).then(res => {
            return new SuccessModel(res)
        })
    }
    // 更新博客
    if (method === 'POST' && path === '/api/blog/update') {

        const result = updateBlog(id, req.body)
        return result.then(updateData => {
           if (updateData) {
            return new SuccessModel(updateData)
           } else {
            return new ErrorModel("更新失败") 
           }
        }).catch(err => {
            return new ErrorModel(err) 
        }) 
    }
    // 删除博客
    if (method === 'POST' && path === '/api/blog/del') {
        const author = req.query.author;
        const result = delBlog(id, author);
        return result.then(delData => {
            if (delData) {
                return new SuccessModel();
            } else {
                return new ErrorModel("删除博客失败") 
            }
        })
    }
}

module.exports = handleBlogRouter