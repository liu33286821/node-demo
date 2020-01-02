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
    const {title, content,author} = blogData;
    const createTime = Date.now();
    const sql = `insert into blogs (title, content, author, createtime) values
         ('${title}', '${content}', '${author}', ${createTime});
    `
    return exec(sql).then(insertData => {
        console.log(insertData, 'inserty');
        return {
            id: insertData.insertId
        }
    });
}

const updateBlog = (id, blogData = {}) => {
    // id 代表更新的内容
    // blogData 是一个博客对象  包含title content 属性
    console.log(id, blogData, "id");
    const {title, content} = blogData

    const sql = `update blogs set title='${title}', content='${content}' where id=${id}`
    return exec(sql).then(updateData => {
        // 影响的函数是否大于0
        if (updateData.affectedRows > 0) {
            return true
        }
        return false
    });
}

const delBlog = (id, author) => {
    // id 要删除的博客
    const sql = `delete from blogs where id=${id} and author='${author}'`;

    return exec(sql).then(deleteData => {
        if (deleteData.affectedRows > 0)  return true; 
        return false
    })
    return true;
} 




module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}