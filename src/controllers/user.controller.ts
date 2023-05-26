import { Request, Response } from 'express'
import { omit } from 'lodash'

import { createUser } from '../services/user.service'
import { createUserInput } from '../schemas/user.schema'
import logger  from '../utils/logger'

export async function createUserHandler(req: Request<{}, {}, createUserInput["body"]>, res: Response) {
    try {
        const user = await createUser(req.body)
        return res.status(201).send(omit(user.toJSON(), "password"))
    } catch (error: any) {
        logger.error(error)
        return res.status(409).send(error.message)
    }
}