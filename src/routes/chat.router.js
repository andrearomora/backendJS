import { Router } from 'express'
import chatModel from '../DAO/mongoManager/chat.model.js'

const router = Router()

router.get('/', async (req, res) => {
    const messages = await chatModel.find().lean().exec()
    res.render('chat', {messages})
})

router.post('/create', async (req, res) => {
    const messageNew = req.body
    console.log(messageNew)
    const messageGenerated = new chatModel(messageNew)
    await messageGenerated.save()

    console.log({ messageGenerated });

    res.redirect('/chat/')
})

export default router