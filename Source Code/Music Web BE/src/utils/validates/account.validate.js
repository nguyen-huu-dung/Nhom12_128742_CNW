const joi = require('joi');

const createAccountValidate = (data) => {
    const Schema = joi.object({
        username: joi.string().alphanum().min(5).max(100).required()
        .messages({"any.required": 'username là bắt buộc'}),
        name: joi.string().pattern(new RegExp('[a-zA-Z" "]|[à-ú]|[À-Ú]')).min(4).max(100).required()
        .messages({'string.pattern.base': `name chỉ chứa kí tự, khoảng trắng từ 4-100 kí tự`, "any.required": 'name là bắt buộc'}),
        email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] }}).required()
        .messages({"any.required": 'email là bắt buộc'}),
        password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,}$')).min(8).required()
        .messages({'string.pattern.base': `password chỉ chứa kí tự, số và tối thiểu 8 kí tự`, "any.required": 'password là bắt buộc'}),
        role: joi.string().valid("admin", "user").required().messages({"any.required": "Role là bắt buộc", "any.only": "role là admin hoặc user"})
    });
    return Schema.validate(data);
}

const updateAccountValidate = (data) => {
    const Schema = joi.object({
        name: joi.string().required().pattern(new RegExp('[a-zA-Z" "]|[à-ú]|[À-Ú]')).min(4).max(100)
        .messages({'string.pattern.base': `name chỉ chứa kí tự, khoảng trắng từ 4-100 kí tự`, "any.required": 'name là bắt buộc'}),
        email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] }}).required()
        .messages({"any.required": 'email là bắt buộc'}),
        address: joi.string().pattern(new RegExp('[a-zA-Z0-9",""-"" "]|[à-ú]|[À-Ú]')).messages({
            'string.pattern.base': 'address chỉ chứa kí tự, số, dấu ",", dấu "-" và khoảng trắng'
        }).allow(""),
        country: joi.string().pattern(new RegExp('[a-zA-Z" "]|[à-ú]|[À-Ú]')).messages({
            'string.pattern.base': 'country chỉ chứa kí tự và khoảng trắng'
        }).allow("")
    })
    return Schema.validate(data);
}

// validate change password
const passwordValidate = (data) => {
    const schema = joi.object({
        current_password: joi.string().required().messages({
            "any.required": 'current_password là bắt buộc'
        }),
        new_password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,}$')).min(8).required()
        .messages({'string.pattern.base': `password chỉ chứa kí tự, số và tối thiểu 8 kí tự`, "any.required": 'new_password là bắt buộc'}),
    });
    return schema.validate(data);
}


module.exports = { createAccountValidate, updateAccountValidate, passwordValidate };