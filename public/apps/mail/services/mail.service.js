// mail service

import { getTruthyValues, loadFromStorage, saveToStorage } from "../../../services/util.service.js"

const BASE_URL = '/api/mail/'

const loggedinUser = {
  email: 'user@snoogle.com',
  fullname: 'Shaham Tamir'
}

export const mailService = {
  query,
  get,
  remove,
  save,
  getEmptyMail,
  getParamsFromSearchParams,
  getUnreadByStatus,
}

// get/read for display
function query(filterBy = {}) {
  return axios.get(BASE_URL, { params: filterBy })
    .then(res => res.data)
}

function get(mailId) {
  return axios.get(BASE_URL + mailId)
    .then(res => res.data)
}

function remove(mailId) {
  return axios.delete(BASE_URL + mailId)
}

function save(mail) {
  if (mail._id) {
    return axios.put(BASE_URL + mail._id, mail)
      .then(res => res.data)
  } else {
    return axios.post(BASE_URL, mail)
      .then(res => res.data)
  }
}

function getUnreadByStatus() {
  const statuses = ['trash', 'sent', 'starred', 'draft', 'unread', 'inbox'];

  const promises = statuses.map(status =>
    query({ status })
      .then(mails => {
        mails.mailsToDisplay.filter(m => !m.isRead).length
      })

  );

  return Promise.all(promises)
    .then(counts =>
      statuses.reduce((acc, status, i) => {
        const count = counts[i];
        // store as string, or empty string if zero:
        acc[status] = count > 0 ? String(count) : '';
        return acc;
      }, {})
    );
}


function getEmptyMail() {
  return {
    createdAt: Date.now(),
    subject: '',
    body: '',
    isRead: false,
    sentAt: null,
    removedAt: null,
    from: `${loggedinUser.email}`,
    fromName: `${loggedinUser.fullname}`,
    to: '',
    labels: [],
  }
}


function getParamsFromSearchParams(searchParams) {
  const compose = searchParams.get('compose') || ''
  const txt = searchParams.get('txt') || ''
  const status = searchParams.get('status') || ''
  const lables = searchParams.get('lables') || ''
  const filterfrom = searchParams.get('filterfrom') || ''
  const filterto = searchParams.get('filterto') || ''
  const newsubject = searchParams.get('newsubject') || ''
  const newbody = searchParams.get('newbody') || ''
  const currpage = searchParams.get('currpage') || ''

  const cleanParams = getTruthyValues({
    compose,
    txt,
    status,
    lables,
    filterfrom,
    filterto,
    newsubject,
    newbody,
    currpage,
  })

  return cleanParams
}



// function _setNextPrevmailId(mail) {
//     return query().then((mails) => {
//         const mailIdx = mails.findIndex((currmail) => currmail._id === mail._id)
//         const nextmail = mails[mailIdx + 1] ? mails[mailIdx + 1] : mails[0]
//         const prevmail = mails[mailIdx - 1] ? mails[mailIdx - 1] : mails[mails.length - 1]
//         mail.nextmailId = nextmail._id
//         mail.prevmailId = prevmail._id
//         return mail
//     })
// }



