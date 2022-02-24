const { AccountRepository } = require("../repositories");
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { Error500, Error400 } = require("../core/httpError");
const saltRounds = process.env.SALT_ROUNDS || 10;

class AccountService {

    constructor() {
        this.accountRepository = AccountRepository;
    }

    async asyncCreateAccount(payload) {
        try {
            const { username, name, email, password } = payload;

            // Kiểm tra tài khoản có tồn tại?
            const existedUsername = await this.asyncFindAccount({username});
            if(existedUsername) return new Error400("Tài khoản đã tồn tại");

            // Kiểm tra email có tồn tại?
            const existedEmail = await this.asyncFindAccount({email});
            if(existedEmail) return new Error400("Email đã tồn tại");

            // hash password
            const salt = bcrypt.genSaltSync(Number(saltRounds));
            const hashPassword = bcrypt.hashSync(password, salt);

            // tạo tài khoản mới
            await this.accountRepository.create({
                ...payload,
                password: hashPassword,
                createdAt: Date.now()
            })
            return null;
        } catch (error) {
            return new Error500(error.message);
        }
    }

    async asyncUpdateInfoAccount({accountId}, payload) {
        const { name, email, address, country } = payload;

        // Lấy thông tin tài khoản
        const account = await this.asyncFindAccount(({_id: mongoose.Types.ObjectId(accountId)}));

        // Kiểm tra email có tồn tại không?
        if(email !== account.email) {
            // Kiểm tra email có tồn tại?
            const existedEmail = await this.asyncFindAccount({email});
            if(existedEmail) return new Error400("Email đã tồn tại");
        }

        
        const result = await this.accountRepository.update({ option: { _id: mongoose.Types.ObjectId(accountId) }, 
        data: { ...payload, updatedAt: Date.now() } });
        const { username, role, avatar, status, createdAt, updatedAt } = result;
        return { accountId, username, name, role, email, avatar, address, country, status, createdAt, updatedAt};
    }

    async asyncChangePassword({accountId}, payload) {
        const { current_password, new_password } = payload;

        // Lấy thông tin tài khoản
        const account = await this.asyncFindAccount(({_id: mongoose.Types.ObjectId(accountId)}));

        // Kiểm tra mật khẩu
        const checkPassword = bcrypt.compareSync(current_password, account.password);
        if(!checkPassword) return new Error400('Mật khẩu hiện tại không đúng');

        // hash new password
        const salt = bcrypt.genSaltSync(Number(saltRounds));
        const password = bcrypt.hashSync(new_password, salt);

        await this.accountRepository.update({ option: { _id: mongoose.Types.ObjectId(accountId) },
        data: { password, updatedAt: Date.now() } });
        return null;
    }

    async asyncFindAccount(option) {
        return this.accountRepository.findOne(option);
    }   

    async asyncUpdateAccount(option, data) {
        return this.accountRepository.update({ option, data });
    }

    async asyncGetAllAccount(option) {
        return this.accountRepository.findAll(option);
    }
}

module.exports = new AccountService();