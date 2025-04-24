import fs from 'fs'
import { utilService } from './util.service.js'

const gMails = utilService.readJsonFile('data/mails.json')


const loggedinUser = {
    email: 'user@snoogle.com',
    fullname: 'Shaham Tamir'
  }

export const mailService = {
    query,
    getById,
    save,
    remove,
}

function query(filterBy = {}) {
    let mailsToDisplay = gMails
    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        mailsToDisplay = mailsToDisplay.filter(mail =>
            regExp.test(mail.subject)
            || regExp.test(mail.body)
            || regExp.test(mail.from)
            || regExp.test(mail.fromName)
        )
    }
    if (filterBy.status) {
        switch (filterBy.status) {
            case "inbox":
                mailsToDisplay = mailsToDisplay.filter(mail =>
                    mail.to === loggedinUser.email
                    && mail.removedAt === null
                    && mail.sentAt
                )
                break
            case "unread":
                mailsToDisplay = mailsToDisplay.filter(mail =>
                    mail.to === loggedinUser.email
                    && !mail.removedAt
                    && mail.sentAt
                    && !mail.isRead
                )
                break

            case "draft":
                mailsToDisplay = mailsToDisplay.filter(mail =>
                    mail.from === loggedinUser.email
                    && !mail.removedAt
                    && !mail.sentAt
                )
                break

            case "starred":
                mailsToDisplay = mailsToDisplay.filter(mail =>
                    mail.isStarred === true
                    && !mail.removedAt
                    && mail.sentAt
                )
                break

            case "sent":
                mailsToDisplay = mailsToDisplay.filter(mail =>
                    mail.from === loggedinUser.email
                    && !mail.removedAt
                    && mail.sentAt
                )
                break

            case "trash":
                mailsToDisplay = mailsToDisplay.filter(mail =>
                    mail.removedAt
                )
                break

        }
    }

    if (filterBy.filterfrom && filterBy.filterfrom !== 'null') {
        const from = new Date(filterBy.filterfrom).getTime()
        console.log("from: ", from)
        mailsToDisplay = mailsToDisplay.filter(mail => mail.sentAt > from)
    }
    if (filterBy.filterto && filterBy.filterto !== 'null') {
        const to = new Date(filterBy.filterto).getTime()
        console.log("to: ", to)
        mailsToDisplay = mailsToDisplay.filter(mail => mail.sentAt < to)
    }

    mailsToDisplay = mailsToDisplay.sort((a, b) => b.sentAt - a.sentAt)

    return Promise.resolve(mailsToDisplay)
}


function getById(mailId) {
    const mail = gMails.find(mail => mail._id === mailId)
    if (!mail) return Promise.reject(`mail ${mailId} was not found`)
    else return Promise.resolve(mail)
}

function save(mailToSave) {
    if (mailToSave._id) {
        const mailIdx = gMails.findIndex(mail => mail._id === mailToSave._id)
        if (mailIdx === -1) return Promise.reject('could not save mail, id was not found')
        else gMails[mailIdx] = mailToSave
    } else {
        mailToSave._id = utilService.makeId()
        mailToSave.createdAt = Date.now()
        gMails.push(mailToSave)
    }

    return _saveMailsToFile()
        .then(() => mailToSave)
}

function remove(mailId) {
    const idx = gMails.findIndex(mail => mail._id === mailId)
    if (idx === -1) return Promise.reject('No bug found')
    gMails.splice(idx, 1)
    return _saveMailsToFile()
}

function _saveMailsToFile() {
    return new Promise((resolve, reject) => {
        fs.writeFile('data/mails.json', JSON.stringify(gMails, null, 2), (err) => {
            if (err) {
                console.log(err);
                reject('Cannot write to file')
            } else {
                console.log('Wrote Successfully!')
                resolve()
            }
        })
    })
}


// function _createmails() {
//     if (!loadFromStorage(MAIL_DB_KEY) || loadFromStorage(MAIL_DB_KEY).lentgh === 0) {
//       const mails = _createDemoMails()
//       saveToStorage(MAIL_DB_KEY, mails)
//     }
//   }
  
//   function _createDemoMails() {
//     const mails = demoMails
//     return mails
//   } 