import fs from 'fs'
import { utilService } from './util.service.js'

const gMails = utilService.readJsonFile('data/mails.json')


export const mailService = {
    query,
    getById,
    save,
    remove,
}

function query() {
    let mailsToDisplay = gMails
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