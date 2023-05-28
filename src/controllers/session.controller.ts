import { Request, Response } from "express";
import config from "config";

import { validatePassword } from "../services/user.service";
import { createSession, findSessions } from "../services/session.service";
import { signJwt } from "../utils/jwt.utils";



export async function createUserSessionHandler(req: Request, res: Response) {
    // validate user's password
    const user = await validatePassword(req.body)
    if (!user) {
        return res.status(401).send("Invalid email or password")
    }

    // create a session
    const session = await createSession(user._id, req.get("user-agent") || "")

    // create access token
    const accessToken = signJwt(
        { ...user, session: session._id },
        { expiresIn: config.get("accessTokenTtl") }
    )
    // create refresh token
    const refreshToken = signJwt(
        { ...user, session: session._id },
        { expiresIn: config.get("refreshTokenTtl") }
    )

    // return access & refresh tokens
    return res.send({ accessToken, refreshToken })
}

export async function getUserSessionsHandler(req: Request, res: Response) {
    const userId = res.locals.user._id;
    const sessions = await findSessions({user: userId, valid: true});
    return res.send(sessions);
}