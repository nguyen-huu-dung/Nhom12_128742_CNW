const joi = require('joi');
const { listBadWords } = require('./bad_words');

const commentValidate = (data) => {
    const Schema = joi.object({
        content: joi.string().required().max(150).messages({"any.required": "Thiếu nội dung bình luận"}).custom((value, helper) => {
            const convertValue = value.replace(/\s/g, "_");
            let checkBadWord = false;

            for(let word of listBadWords) {
                if(checkBadWord) break;
                if(convertValue.includes(word)) {
                    checkBadWord = true;
                    return helper.message("Bình luận chứa từ nhạy cảm! Hãy bình luận văn minh, lịch sự!");
                }
            }
        
            return value;
        })
    })
    return Schema.validate(data);
}

module.exports = { commentValidate };