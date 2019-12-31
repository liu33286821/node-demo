const {exec} = require('../db/mysql');
const getList = (author, keyword) => {
    // 先返回假数据  格式是正确的
    // 这里增加1=1 主要怕 author 和keyword没有值，查询报错
    let sql = `select id,title,content,author,createtime from blogs where 1=1 `;
    if (author) {
        sql += `and author='${author}' `
    }
    if (keyword) {
        sql += `and title like '%${keyword}%'  `
    }
    sql += `order by createtime desc`;
    // 返回promise
    return exec(sql)
}
const getDetail = id => {

    let sql = `select id, title, content, author, createtime from blogs where id='${id}' `;
    //先返回假数据
    return exec(sql).then(rows => {
        return rows[0];
    });
}

const newBlog = (blogData = {}) => {
    // blogData 是一个博客对象  包含title content 属性
    console.log(blogData)
    return {
        id: 3, //表示新建博客 插入到数据库表里的ID
    }
}

const updateBlog = (id, blogData = {}) => {
    // id 代表更新的内容
    // blogData 是一个博客对象  包含title content 属性
    console.log(id, blogData, "id");
    return true
}

const delBlog = (id) => {
    // id 要删除的博客
    return true;
} 




module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}