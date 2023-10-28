import { Router } from 'express'
import passport from 'passport'
import UserModel from '../DAO/mongoManager/users.model.js'

const router = Router()

router.post('/login', passport.authenticate('login', '/login'), async (req,res) => {
    
    if(!req.user) return res.status(400).send('Invalid Credentials')
    req.session.user = req.user
    return res.redirect('/products')
})

router.post(
    '/register',
    passport.authenticate('register',{failureRedirect: '/register'}),
    async (req,res) => {
        return res.redirect('/login')
})

router.get(
    '/login-github',
    passport.authenticate('github',{scope: ['user:email']}),
    async (req,res) => {
        req.session.user = req.user
    })

router.get(
    '/githubcallback',
    passport.authenticate('github',{failureRedirect: '/fail-github'}),
    async (req,res) => {
        console.log('Callback:', req.user)
        res.cookie('keyCookieForJWT', req.user.token).redirect('/products')
        // req.session.user = req.user
        // console.log(req.session)
        // res.redirect('/products')
    })

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) return res.send('Logout error')
        return res.redirect('/login')
    })
}) 

router.get('/current', 
    passport.authenticate('jwt'),
    (req, res) => {
        console.log(req.user)
        const { user } = req
        res.render('current', user)
})

export default router