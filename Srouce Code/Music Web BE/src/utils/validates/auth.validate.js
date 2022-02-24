const joi = require('joi');

const loginValidate = (data) => {
    const Schema = joi.object({
        username: joi.required().messages({"any.required": "username là bắt buộc"}),
        password: joi.required().messages({"any.required": "password là bắt buộc"}),
        role: joi.string().valid("admin", "user").required().messages({"any.required": "role là bắt buộc", "any.only": "role là admin hoặc user"})
    })
    return Schema.validate(data);
}

module.exports = { loginValidate };