import { Express, Request, Response } from "express"

import {
    createUserSessionHandler,
    getUserSessionsHandler,
    deleteSessionHandler
} from "./controllers/session.controller"
import { createUserHandler } from "./controllers/user.controller"
import { createProductHandler, deleteProductHandler, getProductHandler, updateProductHandler } from "./controllers/product.controller"
import validateResource from "./middlewares/validateResource"
import requireUser from "./middlewares/requireUser"
import { createSessionSchema } from "./schemas/session.schema"
import { createUserSchema } from "./schemas/user.schema"
import { createProductSchema, deleteProductSchema, getProductSchema, updateProductSchema } from "./schemas/product.schema"

function routes(app: Express) {
    app.get('/healthcheck', (req: Request, res: Response) => res.sendStatus(200))

    app.post('/api/users', validateResource(createUserSchema), createUserHandler)

    app.post('/api/sessions', validateResource(createSessionSchema), createUserSessionHandler)

    app.get('/api/sessions', requireUser, getUserSessionsHandler)

    app.delete('/api/sessions', requireUser, deleteSessionHandler)

    app.post(
        "/api/products",
        [requireUser, validateResource(createProductSchema)],
        createProductHandler
    );

    app.put(
        "/api/products/:productId",
        [requireUser, validateResource(updateProductSchema)],
        updateProductHandler
    );

    app.get(
        "/api/products/:productId",
        validateResource(getProductSchema),
        getProductHandler
    );

    app.delete(
        "/api/products/:productId",
        [requireUser, validateResource(deleteProductSchema)],
        deleteProductHandler
    );
}

export default routes