import passport from "passport"
import local from "passport-local"
import UserModel from "../DAO/mongoManager/users.model.js"
import { createHash, isValidPassword } from "../utils.js"
import GitHubStrategy from 'passport-github2'

//App ID: 384129
//Client ID: Iv1.95aa3e7d85345c73
//dee1a2a092730055b557cf27f661402f67666840

const LocalStrategy = local.Strategy

const initializePassword = () => {
    
    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv1.95aa3e7d85345c73',
            clientSecret: 'dee1a2a092730055b557cf27f661402f67666840',
            callbackURL: 'http://127.0.0.1:8080/api/session/githubcallback'
        },
        async(accesToken, refreshToken, profile, done)=>{
            console.log(profile)
            try{
                const user = await UserModel.findOne({ email: profile._json.email})
                if(user){
                    console.log('User already exist' + email)
                    return done(null, user)
                }
                const newUser = {
                    first_name: profile._json.name,
                    email: profile._json.email,
                    last_name: profile._json.username,
                    age: profile._json.public_repos,
                    rol: 'user',
                    password: ''
                }
                const result = await UserModel.create(newUser)
                return done(null, result)
            }catch(e){
                return done('Error to login with GitHub' + e)
            }
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

    passport.serializeUser((user,done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })

}

export default initializePassword
