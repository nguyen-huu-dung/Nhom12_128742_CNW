const joi = require('joi');

const contactValidate = (data) => {
    const Schema = joi.object({
        email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] }}).required()
        .messages({"any.required": 'email là bắt buộc'}),
        title: joi.string().required().messages({"any.required": "title không thể thiếu"}),
        content: joi.string().required().messages({"any.required": "content không thể thiếu"})
    });
    return Schema.validate(data);
}

module.exports =  { contactValidate };