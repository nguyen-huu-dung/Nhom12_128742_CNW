const { Error500, Error400 } = require("../core/httpError");
const { AccountRepository, TokenRepository } = require("../repositories");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const json_key = process.env.JSON_WEB_TOKEN_KEY || "jsonwebtokenkey";

class AuthService {


    constructor() {
        this.accountRepository = AccountRepository;
        this.tokenRepository = TokenRepository;
    }

    // đăng nhập
    async asyncLogin(payload) {
        try {
            const { username, password, role } = payload;

            // Kiểm tra tài khoản có tồn tại không?
            const existedAccount = await this.accountRepository.findOne({username, role});
            if(!existedAccount) return new Error400('Tài khoản hoặc mật khẩu không đúng');

            // Kiểm tra tài khoản có bị khóa
            if(existedAccount.status === "block") return new Error400("Tài khoản đã bị khóa"); 

            // kiểm tra password
            const checkPassword = bcrypt.compareSync(password, existedAccount.password);
            if(!checkPassword) return new Error400('Tài khoản hoặc mật khẩu không đúng');

            // tạo token
            const token = jwt.sign({id: existedAccount._id, role: existedAccount.role}, json_key, { expiresIn: "48h" });

            // Lưu token
            await this.tokenRepository.create({accountId: existedAccount._id, token, createdAt: Date.now()});

            return { accountId: existedAccount._id, role: existedAccount.role, name: existedAccount.name, token };
        } catch (error) {
            return new Error500(error.message);
        }
    }

    async asyncUpdateToken(token) {
        return this.tokenRepository.update({ option: {token}, data: {status: "deleted", updatedAt: Date.now() }});
    }
}

module.exports = new AuthService();