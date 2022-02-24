require('dotenv').config({path: __dirname + "/.env"});
const express = require('express');
const app = express();
const PORT = process.env.PORT || 2709;
const clientUrl = process.env.CLIENT_DEPLOY_URL || process.env.CLIENT_LOCAL_URL;
const { connectDb } = require("./core/config/database.config");
const cors = require('cors');
const { middlewares } = require('./utils/middlewares');
const { router } = require('./routers');

// middleware
app.use(cors({
    origin: clientUrl,
    credentials: true
}))
app.use(express.json());
middlewares(app);

// connect database
connectDb();

// router server
router(app);

// start server
app.listen(PORT, () => console.log(`Server is listening at port ${PORT}...`));