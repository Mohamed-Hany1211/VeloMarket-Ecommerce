// modules imports
import { gracefulShutdown } from "node-schedule";
// files imports
import db_connection from "../DB/db.connection.js";
import * as routers from './index.routes.js';
import { globalResponses } from "./middlewares/Global-responses.js";
import { rollbackSavedDocuments } from "./middlewares/Rollback-saved-documents.middleware.js";
import { rollbackUploadedFiles } from "./middlewares/Rollback-uploaded-files.middleware.js";
import { cronToCancelUnpaidOrders } from "./modules/Order/utils/crons-for-order-cancellation.js";


export const intiateApp = (app,express)=>{

    const port = process.env.PORT;

    app.use(express.json());

    app.use('/auth',routers.authRouter);
    app.use('/user',routers.userRouter);
    app.use('/category',routers.categoryRouter);
    app.use('/SubCategory',routers.SubCategoryRouter);
    app.use('/brand',routers.BrandRouter);
    app.use('/product',routers.ProductRouter);
    app.use('/cart',routers.CartRouter);
    app.use('/coupon',routers.CouponRouter);
    app.use('/order',routers.OrderRouter);
    app.use('*', (req,res,next)=>{
        res.status(404).json({message:'Not Found',cause:404});
    })

    app.use(globalResponses,rollbackUploadedFiles,rollbackSavedDocuments)
    cronToCancelUnpaidOrders();
    // gracefulShutdown();
    db_connection();
    app.listen(port,()=>{console.log(`the server is running on port ${port}`);});
}