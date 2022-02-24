const AccountRouter = require("./account.router");
const AuthRouter = require("./auth.router");
const CategoryRouter = require("./category.router");
const CommentRouter = require("./comment.router");
const ContactRouter = require("./contact.router");
const DefaultRouter = require("./default.router");
const MusicRouter = require("./music.router");


const router = (app) => {


    app.use('/account', AccountRouter);
    app.use('/category', CategoryRouter);
    app.use('/music', MusicRouter);
    app.use('/comment', CommentRouter);
    app.use('/contact', ContactRouter);
    app.use('/default', DefaultRouter);
    app.use('/', AuthRouter);

}


module.exports = { router };