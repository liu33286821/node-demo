class BaseModel {
    constructor (data, message) {
        if (typeof data === 'string') {
            this.message = data;
            data = null;
            message = null;
        }
        if (data) { // data 是一个对象
            this.data = data;
        }
        if (message) { // message是一个消息
            this.message = message
        }
    }
}

class SuccessModel extends BaseModel {
    constructor (data, message) {
        super(data, message)
        this.errno = 0;
    }
}

class ErrorModel extends BaseModel {
    constructor (data, message) {
        super(data, message);
        this.errno = -1;
    }
}

module.exports = {
    SuccessModel,
    ErrorModel
}