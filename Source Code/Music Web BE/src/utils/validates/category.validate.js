const joi = require('joi');

const categoryValidate = (data) => {
    const Schema = joi.object({
        category: joi.string().pattern(new RegExp('[a-zA-Z" "]|[à-ú]|[À-Ú]')).min(2).max(100).required()
        .messages({'string.pattern.base': `category chỉ chứa kí tự, khoảng trắng từ 2-100 kí tự`, "any.required": 'category là bắt buộc'})
    })
    return Schema.validate(data);
}

module.exports = { categoryValidate }