import express from 'express'
import cookieParser from 'cookie-parser'
import { mailService } from './services/mail.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

//* Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())
app.set('query parser', 'extended')


app.get('/', (req, res) => res.send('Hello there'))


// get/read for display
app.get('/api/mail', (req, res) => {
    mailService.query()
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

const port = 3031

app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)