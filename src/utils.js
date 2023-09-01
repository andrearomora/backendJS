import {fileURLToPath} from 'url'
import { dirname } from 'path'
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