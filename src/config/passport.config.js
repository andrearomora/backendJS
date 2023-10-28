import passport from "passport"
import local from "passport-local"
import passportJWT, { ExtractJwt } from 'passport-jwt'
import UserModel from "../DAO/mongoManager/users.model.js"
import CartModel from "../DAO/mongoManager/cart.model.js"
import { createHash, isValidPassword, generateToken, authToken, extractCookie } from "../utils.js"
import GitHubStrategy from 'passport-github2'

//App ID: 384129
//Client ID: Iv1.95aa3e7d85345c73
//dee1a2a092730055b557cf27f661402f67666840

const LocalStrategy = local.Strategy
const JWTstrategy = passportJWT.Strategy
const JWTextract = passportJWT.ExtractJwt

const initializePassport = () => {
    
    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv1.95aa3e7d85345c73',
            clientSecret: 'dee1a2a092730055b557cf27f661402f67666840',
            callbackURL: 'http://127.0.0.1:8080/api/session/githubcallback'
        },
        async(accesToken, refreshToken, profile, done)=>{
            console.log(profile)
            try{
                const email = profile._json.login
                console.log(email)
                const user = await UserModel.findOne({ email }).lean().exec()
                if(user){
                    console.log('User already exist' + email)
                }else{
                    console.log('User does not exist' + email)
                    const cart = new CartModel
                    const newUser = {
                        first_name: profile._json.name,
                        email,
                        last_name: profile._json.username,
                        age: profile._json.public_repos,
                        social: 'github',
                        cart: cart._id,
                        rol: 'user',
                        password: ''
                    }
                    const result = await UserModel.create(newUser)
                    console.log('user created: ' + result)
                }
                
                const token = generateToken(user)
                user.token = token
                return done(null, user)
                
            }catch(e){ 
                return done('Error to login with GitHub' + e)
            }
        }
    ))

    passport.use('jwt', new JWTstrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([extractCookie]),
            secretOrKey: 'secretForJWT'
        },
        (jwt_payload, done) => {
            console.log("-------JWT PAYLOAD-------"+{jwt_payload})
            return done(null, jwt_payload)
        }
    ))

    passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },
        async(req, username, password, done) => {
            const { email, first_name, last_name, age, rol} = req.body
            try {
                const user = await UserModel.findOne({email:username})
                if(user){
                    console.log('User already exist');
                    return done(null, false)
                }

                const newUser = {
                    email,
                    first_name,
                    last_name,
                    age,
                    rol: 'user',
                    social: 'local',
                    password: createHash(password)
                }
                const result = await UserModel.create(newUser)
                return done(null, result)
            }catch (e){
                return done('Error to register' + error)
            }
        }
    ))

    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (username, password, done) => {
            try{
                const user = await UserModel.findOne({email: username}).lean().exec()
                if(!user){
                    console.log('User does not exist')
                    return done (null, false)
                }
                if(user.social!='local'){
                    console.log('You need to login with ' + user.social)
                    return done(null, false)
                }
                if(!isValidPassword(user,password)){
                    console.log('Password not valid')
                    return done(null, false)
                }
                return done(null,user)
            }catch(e){
                return done('Error login' + error)
            }
        }
    ))

    passport.use('current', new LocalStrategy(
        { usernameField: 'email' },
        async (username, password, done) => {
            try{
                const user = await UserModel.findOne({email: username}).lean().exec()
                return done(null,user)
            }catch(e){
                return done('Error' + error)
            }
        }
    ))

    passport.serializeUser((user,done) => {
        console.log("--SERIALIZE USER--" + user._id)
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        console.log("--DE--SERIALIZE USER--")
        const user = await UserModel.findById(id)
        console.log(user)
        done(null, user)
    })

}

export default initializePassport
