import {fileURLToPath} from 'url'
import { dirname } from 'path'
import jwt from 'jsonwebtoken'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
import bcryptjs from 'bcryptjs'

export const createHash = (password) => {
    return bcryptjs.hashSync(password, bcryptjs.genSaltSync(10))
}

export const isValidPassword = (user, password) => {
    return bcryptjs.compareSync(password, user.password)
}

export default __dirname

export const generateToken = user => {
    return jwt.sign({user}, 'secretForJWT', {expiresIn: '24h'})
}

export const authToken = (req, res, next) => {
    const authHeader = req.headers.auth

    if(!authHeader){
        return res.status(401).send({error: 'Not Auth'})
    }

    const token = authHeader

    jwt.verify(token, 'secretForJWT', (error, credentials) => {
        if(error) return res.status(403).send({error: 'Not authorized'})
        req.user = credentials.user
        next()
    })
}

export const extractCookie = req => {
    return (req && req.cookies) ? req.cookies['keyCookieForJWT'] : null
}