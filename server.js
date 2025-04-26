import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'
import Cryptr from 'cryptr'

import { mailService } from './services/mail.service.js'
import { loggerService } from './services/logger.service.js'
import { userService } from './services/user.service.js'
import { authService } from './services/auth.service.js'

const app = express()

export const cryptr = new Cryptr(process.env.SECRET1 || 'secret-snoogle-2025')


//* Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())
app.set('query parser', 'extended')


app.get('/', (req, res) => res.send('Hello there'))


// get/read for display
app.get('/api/mail', (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        status: req.query.status || '',
        lables: req.query.lables || [],
        filterfrom: req.query.filterfrom || null,
        filterto: req.query.filterto || null,
        currpage: req.query.currpage || 1,
    }
    mailService.query(filterBy)
        .then(mails => {
            res.send(mails)
        })
        .catch(err => {
            loggerService.error('cannot get mails', err)
            res.status(400).send('cannot get mails')
        })
})


//* Get/Read by id
app.get('/api/mail/:mailId', (req, res) => {
    const { mailId } = req.params
    mailService.getById(mailId)
        .then(mail => {
            res.send(mail)
        })
        .catch(err => {
            loggerService.error(`cannot get mail ${mailId}`, err)
            res.status(400).send(`cannot get mail ${mailId}`)
        })
})

//* Create/Add new
app.post('/api/mail', (req, res) => {

    const mailToSave = {
        subject: req.body.subject,
        body: req.body.body,
        isRead: req.body.isRead,
        sentAt: req.body.sentAt,
        removedAt: req.body.removedAt,
        from: req.body.from,
        to: req.body.to,
        labels: req.body.labels,
        isStarred: req.body.isStarred,
    }

    mailService.save(mailToSave)
        .then(savedMail => {
            console.log("mailToSave: ", mailToSave)
            res.send(savedMail)
        })

        .catch(err => {
            loggerService.error('Cannot save mail', err)
            res.status(400).send('Cannot save mail')
        })
})


//* Edit/Update by id
app.put('/api/mail/:mailId', (req, res) => {

    const mailToSave = {
        _id: req.body._id,
        subject: req.body.subject,
        body: req.body.body,
        isRead: req.body.isRead,
        sentAt: req.body.sentAt,
        removedAt: req.body.removedAt,
        from: req.body.from,
        to: req.body.to,
        labels: req.body.labels,
        isStarred: req.body.isStarred,
    }

    mailService.save(mailToSave)
        .then(savedMail => res.send(savedMail))
        .catch(err => {
            loggerService.error('Cannot save mail', err)
            res.status(400).send('Cannot save mail')
        })
})


//* Remove/Delete
app.delete('/api/mail/:mailId', (req, res) => {
    const { mailId } = req.params
    carService.remove(mailId)
        .then(() => res.send(`Mail removed - ${mailId}`))
        .catch(err => {
            loggerService.error('Cannot remove mail', err)
            res.status(400).send('Cannot remove mail')
        })
})



//* User API
app.get('/api/user', (req, res) => {
    userService.query()
        .then(users => res.send(users))
        .catch(err => {
            loggerService.error('Cannot load users', err)
            res.status(400).send('Cannot load users')
        })
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params

    userService.getById(userId)
        .then(user => res.send(user))
        .catch(err => {
            loggerService.error('Cannot load user', err)
            res.status(400).send('Cannot load user')
        })
})

//* Auth API
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body
    authService.checkLogin({ username, password })
        .then(user => {
            const loginToken = authService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(() => res.status(404).send('Invalid Credentials'))
})

app.post('/api/auth/signup', (req, res) => {
    const { username, password, fullname } = req.body
    userService.add({ username, password, fullname })
        .then(user => {
            if (user) {
                const loginToken = authService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(400).send('Cannot signup')
            }
        })
        .catch(err => {
            console.log('err:', err)
            res.status(400).send('Username taken.')
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})


//* Fallback route
app.get('/*all', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const port = process.env.port || 3031

app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)