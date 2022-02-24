const joi = require('joi');

const musicValidate = (data) => {
    const Schema = joi.object({
        name: joi.string().pattern(new RegExp('[a-zA-Z0-9" "]|[à-ú]|[À-Ú]')).min(2).max(100).required()
        .messages({
            "any.required": "name là bắt buộc",
            "string.pattern.base": "name chỉ chứa kí tự, số và khoảng trắng từ 2-100 kí tự"
        }),
        category: joi.string().pattern(new RegExp('[a-zA-Z" "]|[à-ú]|[À-Ú]')).min(2).max(100).required()
        .messages({'string.pattern.base': `category chỉ chứa kí tự, khoảng trắng từ 2-100 kí tự`, "any.required": 'category là bắt buộc'}),
        author: joi.string().pattern(new RegExp('[a-zA-Z" "]|[à-ú]|[À-Ú]')).min(2).max(100)
        .messages({"string.pattern.base": "author chỉ chứa kí tự, khoảng trắng từ 2-100 kí tự"}).allow(""),
        singer: joi.string().pattern(new RegExp('[a-zA-Z" "]|[à-ú]|[À-Ú]')).min(2).max(100)
        .messages({"string.pattern.base": "singer chỉ chứa kí tự, khoảng trắng từ 2-100 kí tự"}).allow(""),
        lyrics: joi.string().pattern(new RegExp('[a-zA-Z" "]|[à-ú]|[À-Ú]')).min(2)
        .messages({"string.pattern.base": "lyrics chỉ chứa kí tự, khoảng trắng từ 2 kí tự"}).allow(""),
    });
    return Schema.validate(data);
}

module.exports = { musicValidate };
