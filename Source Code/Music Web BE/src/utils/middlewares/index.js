const { createAccountAuth, adminAuth, checkTokenMiddle, ownerAuth } = require("./middlewares");

const middlewares = (app) => {

    app.post('/logout', checkTokenMiddle);

    app.get('/account', checkTokenMiddle, adminAuth);
    app.get('/account/:accountId', checkTokenMiddle, ownerAuth);
    app.post('/account', createAccountAuth, checkTokenMiddle, adminAuth);
    app.put('/account', checkTokenMiddle);
    app.put('/account/change_password', checkTokenMiddle);
    app.put('/account/change_avatar', checkTokenMiddle);
    app.put('/account/:accountId/block_account', checkTokenMiddle, adminAuth);
    app.put('/account/:accountId/unblock_account', checkTokenMiddle, adminAuth);

    app.post('/category', checkTokenMiddle, adminAuth);
    app.put('/category/:categoryId', checkTokenMiddle, adminAuth);
    app.delete('/category/:categoryId', checkTokenMiddle, adminAuth);

    app.post('/music', checkTokenMiddle, adminAuth);
    app.put('/music/:musicId', checkTokenMiddle, adminAuth);
    app.put('/music/:musicId/change_image', checkTokenMiddle, adminAuth);
    app.put('/music/:musicId/change_music', checkTokenMiddle, adminAuth);
    app.delete('/music/:musicId', checkTokenMiddle, adminAuth);

    app.get('/contact', checkTokenMiddle, adminAuth);
    app.put('/contact/:contactId/is_seen', checkTokenMiddle, adminAuth);
    app.delete('/contact/:contactId', checkTokenMiddle, adminAuth);

    app.post('/comment/:musicId', checkTokenMiddle);
    app.put("/comment/:commentId", checkTokenMiddle);
    app.delete("/comment/:commentId", checkTokenMiddle);
}

module.exports = { middlewares };