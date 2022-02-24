const jwt = require('jsonwebtoken');
const { TokenModel, AccountModel } = require('../../models');
const mongoose = require('mongoose');
const { loggerStart, loggerError } = require('../helpers/supports');
const json_key = process.env.JSON_WEB_TOKEN_KEY || "jsonwebtokenkey";

// middleware kiểm tra token
const checkTokenMiddle = async (req, res, next) => {
    const LOG_TITLE = "Check token";
    loggerStart(LOG_TITLE);
    const token = req.header('token');
    if(!token) return res.status(401).json({data: null, message: "Thiếu token", success: false});
    try{
        // verify token
        const decoded = jwt.verify(token, json_key);
        
        // check token exists database
        const existedToken = await TokenModel.findOne({token, status: "active"});
        if(!existedToken) return res.status(401).json({data: null, message: "Token không đúng hoặc hết hạn", success: false});
        res.locals.decoded = decoded;

        // check account 
        const existedAccount = await AccountModel.findOne({ _id:  mongoose.Types.ObjectId(decoded.id)});
        if(existedAccount.status === "block") {
            return res.status(401).json({data: null, message: "Tài khoản đã bị khóa", success: false});
        }
        next();
    }
    catch(error) {
        loggerError(LOG_TITLE, error.message);
        await TokenModel.findOneAndUpdate({token}, {status: "deleted"});
        res.status(401).json({data: null, success: false, message: "Token không đúng hoặc hết hạn"});
    }
} 

// Phân quyền cho admin
const adminAuth = async (req, res, next) => {
    const LOG_TITLE = "Auth Admin";
    loggerStart(LOG_TITLE);
    try {
        const { id, role } = res.locals.decoded;
        if(role !== "admin") return res.status(401).json({data: null, success: false, message: "Bạn không phải admin"});
        next();
    } catch (error) {
        loggerError(LOG_TITLE, error.message);
        res.status(500).json({data: null, success: false, message: error.message});
    }
}

// Phân quyền người sở hữu tài khoản hoặc admin
const ownerAuth = async (req, res, next) => {
    const LOG_TITLE = "Auth owner";
    loggerStart(LOG_TITLE);
    try {
        const { accountId } = req.params;
        const { id, role } = res.locals.decoded;
        if(accountId === "owner") {
            next();
            return;
        }
        if(role !== "admin" && accountId !== id) return res.status(401).json({data: null, success: false, message: "Bạn không có quyền truy cập"});
        next();
    } catch (error) {
        loggerError(LOG_TITLE, error.message);
        res.status(500).json({data: null, success: false, message: error.message});
    }
}

// Phân quyền đăng ký tài khoản
const createAccountAuth = (req, res, next) => {
    const LOG_TITLE = "Auth create account";
    loggerStart(LOG_TITLE);
    if(req.body.role === "admin") next();
    else next('route');
}

module.exports = { checkTokenMiddle, adminAuth, createAccountAuth, ownerAuth };