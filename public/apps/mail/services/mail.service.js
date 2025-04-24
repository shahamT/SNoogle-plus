// mail service

import { storageService } from "../../../services/async-storage.service.js"
import { getTruthyValues, loadFromStorage, saveToStorage } from "../../../services/util.service.js"



const MAIL_DB_KEY = 'mailDB'

const loggedinUser = {
    email: 'user@snoogle.com',
    fullname: 'Shaham Tamir'
}


_createmails()

export const mailService = {
    query,
    get,
    remove,
    save,
    getEmptyMail,
    getDefaultFilter,
    getParamsFromSearchParams,
    getUnreadByStatus,
}


function query(filterBy = {}) {
    return storageService.query(MAIL_DB_KEY)
        .then(mails => {
            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                mails = mails.filter(mail =>
                    regExp.test(mail.subject)
                    || regExp.test(mail.body)
                    || regExp.test(mail.from)
                    || regExp.test(mail.fromName)
                )
            }
            if (filterBy.status) {
                switch (filterBy.status) {
                    case "inbox":
                        mails = mails.filter(mail =>
                            mail.to === loggedinUser.email
                            && mail.removedAt === null
                            && mail.sentAt
                        )
                        break
                    case "unread":
                        mails = mails.filter(mail =>
                            mail.to === loggedinUser.email
                            && !mail.removedAt
                            && mail.sentAt
                            && !mail.isRead
                        )
                        break

                    case "draft":
                        mails = mails.filter(mail =>
                            mail.from === loggedinUser.email
                            && !mail.removedAt
                            && !mail.sentAt
                        )
                        break

                    case "starred":
                        mails = mails.filter(mail =>
                            mail.isStarred === true
                            && !mail.removedAt
                            && mail.sentAt
                        )
                        break

                    case "sent":
                        mails = mails.filter(mail =>
                            mail.from === loggedinUser.email
                            && !mail.removedAt
                            && mail.sentAt
                        )
                        break

                    case "trash":
                        mails = mails.filter(mail =>
                            mail.removedAt
                        )
                        break

                }
            }

            if (filterBy.filterfrom && filterBy.filterfrom !== 'null') {
                const from = new Date(filterBy.filterfrom).getTime()
                console.log("from: ", from)
                mails = mails.filter(mail => mail.sentAt > from)
            }
            if (filterBy.filterto && filterBy.filterto !== 'null') {
                const to = new Date(filterBy.filterto).getTime()
                console.log("to: ", to)
                mails = mails.filter(mail => mail.sentAt < to)
            }

            mails = mails.sort((a, b) => b.sentAt - a.sentAt)
            return mails
        })
}

function get(mailId) {
    return storageService.get(MAIL_DB_KEY, mailId)
}

function remove(mailId) {
    // return Promise.reject('Oh No!')
    return storageService.remove(MAIL_DB_KEY, mailId)
}

function save(mail) {
    if (mail.id) {
        return storageService.put(MAIL_DB_KEY, mail)
    } else {
        return storageService.post(MAIL_DB_KEY, mail)
    }
}

function getUnreadByStatus() {
    const statuses = ['trash', 'sent', 'starred', 'draft', 'unread', 'inbox'];

    const promises = statuses.map(status =>
        query({ status })  // or mailService.query if that’s your API
            .then(mails => mails.filter(m => !m.isRead).length)
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
        id: '',
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

    const cleanParams = getTruthyValues({
        compose,
        txt,
        status,
        lables,
        filterfrom,
        filterto,
        newsubject,
        newbody,
    })

    return cleanParams
}

function getDefaultFilter() {
    return { txt: '', status: '', lables: [] }
}

// function _setNextPrevmailId(mail) {
//     return query().then((mails) => {
//         const mailIdx = mails.findIndex((currmail) => currmail.id === mail.id)
//         const nextmail = mails[mailIdx + 1] ? mails[mailIdx + 1] : mails[0]
//         const prevmail = mails[mailIdx - 1] ? mails[mailIdx - 1] : mails[mails.length - 1]
//         mail.nextmailId = nextmail.id
//         mail.prevmailId = prevmail.id
//         return mail
//     })
// }


function _createmails() {
    if (!loadFromStorage(MAIL_DB_KEY) || loadFromStorage(MAIL_DB_KEY).lentgh === 0) {
        const mails = _createDemoMails()
        saveToStorage(MAIL_DB_KEY, mails)
    }
}

function _createDemoMails() {
    const mails = [
        {
            id: "60ae6a1a92e5",
            createdAt: 1744654589000,
            subject: "Quick Question About This Weekend",
            body: "Hey, just wanted to check if you're still up for hiking on Saturday. Weather looks good!\n\nLet me know 🌞",
            isRead: false,
            sentAt: 1744654623000,
            removedAt: null,
            from: "maria.gomez@gmail.com",
            to: "user@snoogle.com",
            labels: [],
            isStarred: true
          },
          {
            id: "60ae6a2c387f",
            createdAt: 1744640000000,
            subject: "Invoice #2395 from Nuvix Solutions",
            body: "Hello,\n\nPlease find attached your invoice for services rendered in April 2025. Let us know if you have any questions.\n\nThanks,\nNuvix Accounting Team",
            isRead: true,
            sentAt: 1744640600000,
            removedAt: null,
            from: "billing@nuvix-solutions.com",
            to: "user@snoogle.com",
            labels: [],
            isStarred: false
          },
          {
            id: "60ae6a3e4a28",
            createdAt: 1744630000000,
            subject: "🌟 Your Order #738203 Has Shipped!",
            body: "Hey there!\n\nGreat news — your order from EcoCart has shipped. Track it here: https://track.ecocart.com/738203\n\nThanks for shopping sustainably!\n\nEcoCart Team",
            isRead: false,
            sentAt: 1744630200000,
            removedAt: null,
            from: "notifications@ecocart.com",
            to: "user@snoogle.com",
            labels: [],
            isStarred: false
          },
          {
            id: "60ae6a4d98b2",
            createdAt: 1744620000000,
            subject: "Job Application - Frontend Developer",
            body: "Hi,\n\nAttached is my resume and portfolio for the frontend developer position listed on your site. I'm excited about the opportunity to join your team.\n\nLooking forward to your response.\n\nBest,\nJonathan Silva",
            isRead: true,
            sentAt: 1744620500000,
            removedAt: null,
            from: "jonathan.silva@mail.com",
            to: "user@snoogle.com",
            labels: [],
            isStarred: true
          },
          {
            id: "60ae6a5f94c1",
            createdAt: 1744605000000,
            subject: "🧾 Receipt from MarketLocal (Order #84823)",
            body: "Hi there,\n\nThanks for shopping with MarketLocal.\n\nYour receipt:\n• Apples - $2.99\n• Almond Milk - $3.49\n• Organic Granola - $4.79\n\nTotal: $11.27\n\nWe hope to see you again soon!",
            isRead: true,
            sentAt: 1744605500000,
            removedAt: null,
            from: "orders@marketlocal.com",
            to: "user@snoogle.com",
            labels: [],
            isStarred: false
          },
          {
            id: "60ae6a6ab527",
            createdAt: 1744590000000,
            subject: "Update: Team Meeting Moved to Thursday",
            body: "Hi team,\n\nJust a quick note — this week's design sync will be moved to **Thursday at 10am** instead of Wednesday.\n\nZoom link will be sent closer to the time.\n\nBest,\nNina",
            isRead: true,
            sentAt: 1744590400000,
            removedAt: null,
            from: "nina@loopstudio.io",
            to: "user@snoogle.com",
            labels: [],
            isStarred: true
          },
          {
            id: "60ae6a7e0ff4",
            createdAt: 1744575000000,
            subject: "Personal Reflection for the Retreat",
            body: "I’m not sure how to word this exactly, but maybe something like:\n\n\"During this retreat, I realized that silence is not empty — it’s full of answers.\"\n\nStill workshopping this...",
            isRead: true,
            sentAt: null,
            removedAt: null,
            from: "user@snoogle.com",
            to: null,
            labels: [],
            isStarred: false
          },
          {
            id: "60ae6a8d4021",
            createdAt: 1744550000000,
            subject: "🚨 Action Required: Verify Your Account",
            body: "Hi user,\n\nWe noticed a login attempt from an unrecognized device. Please verify your identity to continue using your account securely:\n\nhttps://secure.trustbank.com/verify\n\nTrustBank Security Team",
            isRead: false,
            sentAt: 1744550100000,
            removedAt: null,
            from: "alerts@trustbank.com",
            to: "user@snoogle.com",
            labels: [],
            isStarred: true
          },
          {
            id: "60ae6a9f7bb6",
            createdAt: 1744540000000,
            subject: "Dinner Plans?",
            body: "Hey you ❤️\n\nWant to do Thai food tonight or cook something together?\n\nAlso, I miss you.\n\n– L.",
            isRead: false,
            sentAt: 1744540200000,
            removedAt: null,
            from: "lea.romano@proton.me",
            to: "user@snoogle.com",
            labels: [],
            isStarred: true
          },
          {
            id: "60ae6ab26fcd",
            createdAt: 1744530000000,
            subject: "Ideas for Workshop Topics",
            body: "- Embracing Uncertainty\n- Building Systems for Creativity\n- How to Prioritize What Actually Matters\n\nThink I need better titles though...",
            isRead: true,
            sentAt: null,
            removedAt: null,
            from: "user@snoogle.com",
            to: null,
            labels: [],
            isStarred: false
          },
          {
            id: "60ae6ac0c18f",
            createdAt: 1744522000000,
            subject: "RE: Thursday's Client Presentation",
            body: "Hi Jenna,\n\nThanks for the deck — looks solid. I’ve added a few notes in the speaker view about the flow.\nCan you double-check slide 5? Data there seems off.\n\nSee you Thursday,\nMike",
            isRead: true,
            sentAt: 1744522200000,
            removedAt: null,
            from: "mike.roberts@cobaltpartners.com",
            to: "user@snoogle.com",
            labels: [],
            isStarred: false
          },
          {
            id: "60ae6ace51a2",
            createdAt: 1744511000000,
            subject: "Flight Confirmation - Tel Aviv → Lisbon",
            body: "Hi Shaham,\n\nYou’re all set!\n\nBooking ref: UZ3847\nDeparture: 12 May, 2025 - 08:30\nArrival: 12 May, 2025 - 14:10\nAirline: TAP Air Portugal\n\nBon voyage 🌍",
            isRead: true,
            sentAt: 1744511100000,
            removedAt: 1744558000000,
            from: "travel@flynow.com",
            to: "user@snoogle.com",
            labels: [],
            isStarred: false
          },
          {
            id: "60ae6ae3053d",
            createdAt: 1744490000000,
            subject: "Fwd: New volunteer orientation guide",
            body: "Hey,\n\nCan you review this before Monday?\nI think we should remove the last section — it feels too heavy for day one.\n\nThanks,\nNaomi",
            isRead: false,
            sentAt: 1744490400000,
            removedAt: null,
            from: "naomi.wertz@greengrass.org",
            to: "user@snoogle.com",
            labels: [],
            isStarred: false
          },
          {
            id: "60ae6af233bf",
            createdAt: 1744477000000,
            subject: "Packing list – don’t forget charger!",
            body: "You forgot it *last time* and ended up buying that overpriced cable 😂\n\nAlso: hiking boots, mosquito spray, and the blue notebook with the campsite sketches.\n\nSafe drive!",
            isRead: true,
            sentAt: 1744477100000,
            removedAt: null,
            from: "noga@bushwalks.org",
            to: "user@snoogle.com",
            labels: [],
            isStarred: true
          },
          {
            id: "60ae6b05f5c9",
            createdAt: 1744460000000,
            subject: "Let’s reconnect",
            body: "Hey...\n\nIt’s been a while, huh? I saw your name pop up in a shared doc at work and realized we haven’t talked in over a year.\n\nWant to grab coffee sometime next week?",
            isRead: false,
            sentAt: 1744460300000,
            removedAt: null,
            from: "daniel.stark@protonmail.com",
            to: "user@snoogle.com",
            labels: [],
            isStarred: false
          },
          {
            id: "60ae6b18462f",
            createdAt: 1744440000000,
            subject: "✏️ Notes for the talk",
            body: "- Keep intro under 2 mins\n- Focus on examples, not definitions\n- Mention that survey!\n\nStill unsure how to wrap it up — maybe ask people what surprised them most?",
            isRead: true,
            sentAt: null,
            removedAt: null,
            from: "user@snoogle.com",
            to: null,
            labels: [],
            isStarred: false
          },
          {
            id: "60ae6b2675b9",
            createdAt: 1744431000000,
            subject: "Please verify your freelance profile",
            body: "Hi Shaham,\n\nThanks for signing up to SkillHub. Before we can publish your profile, please verify your email and complete your skills section.\n\nVerify now → https://skillhub.app/verify",
            isRead: false,
            sentAt: 1744431100000,
            removedAt: 1744488000000,
            from: "no-reply@skillhub.app",
            to: "user@snoogle.com",
            labels: [],
            isStarred: false
          },
          {
            id: "60ae6b37f0aa",
            createdAt: 1744410000000,
            subject: "New Comment on “Campsite Setup Checklist”",
            body: "Eran added a comment:\n\n> Might be worth including backup fire starter.\n\nView the note: https://notespace.com/note/23947\n\n– NoteSpace",
            isRead: true,
            sentAt: 1744410500000,
            removedAt: null,
            from: "updates@notespace.com",
            to: "user@snoogle.com",
            labels: [],
            isStarred: false
          },
          {
            id: "60ae6b4b63cc",
            createdAt: 1744390000000,
            subject: "Start of season checklist draft",
            body: "Still incomplete:\n\n- update permit dates\n- reorder tents\n- check water tank levels\n\nDo we need new gas canisters?",
            isRead: true,
            sentAt: null,
            removedAt: null,
            from: "user@snoogle.com",
            to: null,
            labels: [],
            isStarred: false
          },
          {
            id: "60ae6b5f6ca7",
            createdAt: 1744380000000,
            subject: "Congrats on completing your workshop!",
            body: "Woohoo!\n\nYou’ve officially completed the 'Design Systems for Teams' workshop. Your certificate is available in your dashboard now 🎉\n\nLet us know what you thought!",
            isRead: true,
            sentAt: 1744380200000,
            removedAt: null,
            from: "academy@learnloop.org",
            to: "user@snoogle.com",
            labels: [],
            isStarred: false
          },
          {
            id: "433387394fb9",
            createdAt: 1738466691502,
            subject: "Follow-up on last week's workshop materials",
            body: "Welcome aboard! You’re now part of the beta program. You’ll receive early access invites and updates every month.",
            isRead: false,
            sentAt: 1738467691502,
            removedAt: null,
            from: "yara@greenworld.org",
            to: "user@snoogle.com",
            labels: [],
            isStarred: false
          },
          {
            id: "7b7df17dbe9f",
            createdAt: 1702690582502,
            subject: "Welcome to the beta program!",
            body: "Great session today! I’ve added my notes to the shared doc here: https://notes.com/session23. Looking forward to the next one!",
            isRead: true,
            sentAt: 1702691612502,
            removedAt: null,
            from: "team@clarifyhub.net",
            to: "user@snoogle.com",
            labels: [],
            isStarred: false
          },
          {
            id: "4cd2d0b9b73f",
            createdAt: 1689449392502,
            subject: "📦 Package Delivered: EcoKit Order #23422",
            body: "Hi team,\n\nPlease take a moment to review the Q2 goals doc and leave any feedback by Friday. This will help us finalize direction before the next sprint.",
            isRead: true,
            sentAt: null,
            removedAt: null,
            from: "user@snoogle.com",
            to: null,
            labels: [],
            isStarred: false
          },
          {
            id: "59e54bca8e57",
            createdAt: 1715947900502,
            subject: "Cool",
            body: "👍",
            isRead: true,
            sentAt: null,
            removedAt: null,
            from: "user@snoogle.com",
            to: null,
            labels: [],
            isStarred: true
          },
          {
            id: "943282feca2a",
            createdAt: 1727870620503,
            subject: "See u",
            body: "Talk later.",
            isRead: false,
            sentAt: 1727871680503,
            removedAt: null,
            from: "info@horizonsgear.com",
            to: "user@snoogle.com",
            labels: [],
            isStarred: true
          },
          {
            id: "c84d81c1a7b9",
            createdAt: 1695524200503,
            subject: "Thanks",
            body: "Perfect, thanks!",
            isRead: true,
            sentAt: 1695524800503,
            removedAt: null,
            from: "sophie.lee@gmail.com",
            to: "user@snoogle.com",
            labels: [],
            isStarred: false
          },
          {
            id: "5f11e246f6b3",
            createdAt: 1709318200503,
            subject: "Reminder: Annual Team Survey Closes Tomorrow",
            body: "Hi,\n\nJust a reminder that the team engagement survey closes tomorrow at 5pm. Your feedback is anonymous and really helps shape our work environment.\n\nThanks!",
            isRead: true,
            sentAt: 1709318650503,
            removedAt: 1712310000503,
            from: "alerts@vaultbank.com",
            to: "user@snoogle.com",
            labels: [],
            isStarred: false
          },
          {
            id: "a63f02b97dc4",
            createdAt: 1686732500503,
            subject: "Sure",
            body: "No problem.",
            isRead: false,
            sentAt: 1686733100503,
            removedAt: null,
            from: "reply@nomadnetwork.com",
            to: "user@snoogle.com",
            labels: [],
            isStarred: false
          },
          {
            id: "8c8fba594ee2",
            createdAt: 1701217000503,
            subject: "Approved",
            body: "Sent.",
            isRead: true,
            sentAt: 1701217400503,
            removedAt: null,
            from: "admin@flowpulse.io",
            to: "user@snoogle.com",
            labels: [],
            isStarred: false
          },
          {
            id: "dde5eb924ef7",
            createdAt: 1721045200503,
            subject: "Upcoming deadline for project deliverables",
            body: "Just a heads-up — the final deadline for deliverables is now next Wednesday. Ping me if you’re blocked on anything.",
            isRead: false,
            sentAt: 1721045600503,
            removedAt: null,
            from: "david.levy@freelance.com",
            to: "user@snoogle.com",
            labels: [],
            isStarred: true
          },
          {
            id: "f0273b7e4f99",
            createdAt: 1700144200503,
            subject: "OK",
            body: "Noted.",
            isRead: true,
            sentAt: 1700144600503,
            removedAt: null,
            from: "support@notetracker.app",
            to: "user@snoogle.com",
            labels: [],
            isStarred: false
          },
          {
            id: "c3e456d92873",
            createdAt: 1694386200503,
            subject: "Done",
            body: "Will do.",
            isRead: false,
            sentAt: 1694386900503,
            removedAt: null,
            from: "friends@slowmail.cc",
            to: "user@snoogle.com",
            labels: [],
            isStarred: false
          },
          {
            id: "7bcb4d8a1f2d",
            createdAt: 1717373200503,
            subject: "Details for tomorrow's offsite meetup",
            body: "Tomorrow’s meetup starts at 10am sharp. We’ll provide breakfast, but bring water and sunscreen for the hike!",
            isRead: false,
            sentAt: 1717373700503,
            removedAt: null,
            from: "team@clarifyhub.net",
            to: "user@snoogle.com",
            labels: [],
            isStarred: true
          },
          {
            id: "ed1b899e5a68",
            createdAt: 1725038800503,
            subject: "Guidelines for submitting your travel receipts",
            body: "Don’t forget to upload your travel receipts by EOD Thursday so we can process reimbursements before the break.",
            isRead: true,
            sentAt: 1725039100503,
            removedAt: 1725049200503,
            from: "admin@flowpulse.io",
            to: "user@snoogle.com",
            labels: [],
            isStarred: false
          },
          {
            id: "60ee998b5fce",
            createdAt: 1711215200503,
            subject: "✏️ Notes for the talk",
            body: "- Keep intro under 2 mins\n- Focus on examples, not definitions\n- Mention that survey!\n\nStill unsure how to wrap it up — maybe ask people what surprised them most?",
            isRead: true,
            sentAt: null,
            removedAt: null,
            from: "user@snoogle.com",
            to: null,
            labels: [],
            isStarred: false
          },
          {
            id: "149fd9b4b320",
            createdAt: 1706042800503,
            subject: "Got it.",
            body: "On it.",
            isRead: true,
            sentAt: 1706043000503,
            removedAt: null,
            from: "sophie.lee@gmail.com",
            to: "user@snoogle.com",
            labels: [],
            isStarred: false
          },
          {
            id: "a13f0a226e99",
            createdAt: 1693128000503,
            subject: "RE: Thursday's Client Presentation",
            body: "Hi Jenna,\n\nThanks for the deck — looks solid. I’ve added a few notes in the speaker view about the flow.\nCan you double-check slide 5? Data there seems off.\n\nSee you Thursday,\nMike",
            isRead: true,
            sentAt: 1693128500503,
            removedAt: null,
            from: "david.levy@freelance.com",
            to: "user@snoogle.com",
            labels: [],
            isStarred: false
          },
          {
            id: "d6bb238e5dc1",
            createdAt: 1687992400503,
            subject: "Fwd: New volunteer orientation guide",
            body: "Hey,\n\nCan you review this before Monday?\nI think we should remove the last section — it feels too heavy for day one.\n\nThanks,\nNaomi",
            isRead: false,
            sentAt: 1687992700503,
            removedAt: null,
            from: "naomi.wertz@greengrass.org",
            to: "user@snoogle.com",
            labels: [],
            isStarred: false
          },
          {
            id: "b89166b8ec55",
            createdAt: 1699911400503,
            subject: "Flight Confirmation - Tel Aviv → Lisbon",
            body: "Hi Shaham,\n\nYou’re all set!\n\nBooking ref: UZ3847\nDeparture: 12 May, 2025 - 08:30\nArrival: 12 May, 2025 - 14:10\nAirline: TAP Air Portugal\n\nBon voyage 🌍",
            isRead: true,
            sentAt: 1699911600503,
            removedAt: 1702138000503,
            from: "travel@flynow.com",
            to: "user@snoogle.com",
            labels: [],
            isStarred: false
          },
          {
            id: "cd2c1b4c9aa7",
            createdAt: 1714524600503,
            subject: "Start of season checklist draft",
            body: "Still incomplete:\n\n- update permit dates\n- reorder tents\n- check water tank levels\n\nDo we need new gas canisters?",
            isRead: true,
            sentAt: null,
            removedAt: null,
            from: "user@snoogle.com",
            to: null,
            labels: [],
            isStarred: false
          },
          {
            id: "321ff1a6f1a9",
            createdAt: 1704461772519,
            subject: "Follow-up on last week's workshop materials",
            body: "Your EcoKit box has been delivered to your front door. Let us know what you think of the new packaging!",
            isRead: true,
            sentAt: 1704462348600,
            removedAt: null,
            from: "support@notetracker.app",
            to: "user@snoogle.com",
            labels: [],
            isStarred: true
          },
          {
            id: "a414b233d755",
            createdAt: 1740498119520,
            subject: "Yes",
            body: "Safe travels!",
            isRead: true,
            sentAt: 1740498240942,
            removedAt: null,
            from: "reply@nomadnetwork.com",
            to: "user@snoogle.com",
            labels: [],
            isStarred: false
          },
          {
            id: "e4975891c40c",
            createdAt: 1727920762520,
            subject: "Feedback Requested: Q2 Goals Planning Document",
            body: "Hey,\n\nAttached are the slides and transcript from last week's workshop. Feel free to share with anyone who missed it.\n\nCheers,\nJordan",
            isRead: true,
            sentAt: 1727920833794,
            removedAt: null,
            from: "sophie.lee@gmail.com",
            to: "user@snoogle.com",
            labels: [],
            isStarred: false
          },
          {
            id: "36fd6b63a547",
            createdAt: 1744479391520,
            subject: "Feedback Requested: Q2 Goals Planning Document",
            body: "We've detected unusual activity in your account. As a precaution, please reset your password within the next 24 hours to maintain access.",
            isRead: true,
            sentAt: 1744479487742,
            removedAt: 1739839341520,
            from: "david.levy@freelance.com",
            to: "user@snoogle.com",
            labels: [],
            isStarred: true
          },
          {
            id: "98938d7261d1",
            createdAt: 1719379920521,
            subject: "Guidelines for submitting your travel receipts",
            body: "Tomorrow’s meetup starts at 10am sharp. We’ll provide breakfast, but bring water and sunscreen for the hike!",
            isRead: false,
            sentAt: 1719380454978,
            removedAt: 1718464553521,
            from: "david.levy@freelance.com",
            to: "user@snoogle.com",
            labels: [],
            isStarred: true
          },
          {
            id: "bc02a215803f",
            createdAt: 1725673951521,
            subject: "📦 Package Delivered: EcoKit Order #23422",
            body: "Hi,\n\nJust a reminder that the team engagement survey closes tomorrow at 5pm. Your feedback is anonymous and really helps shape our work environment.\n\nThanks!",
            isRead: false,
            sentAt: 1725674549954,
            removedAt: null,
            from: "sophie.lee@gmail.com",
            to: "user@snoogle.com",
            labels: [],
            isStarred: true
          },
          {
            id: "054d0e79decc",
            createdAt: 1714422792521,
            subject: "Guidelines for submitting your travel receipts",
            body: "We've detected unusual activity in your account. As a precaution, please reset your password within the next 24 hours to maintain access.",
            isRead: false,
            sentAt: 1714423010808,
            removedAt: 1708308426521,
            from: "friends@slowmail.cc",
            to: "user@snoogle.com",
            labels: [],
            isStarred: false
          },
          {
            id: "e82687821a15",
            createdAt: 1698208798521,
            subject: "Details for tomorrow's offsite meetup",
            body: "Welcome aboard! You’re now part of the beta program. You’ll receive early access invites and updates every month.",
            isRead: true,
            sentAt: null,
            removedAt: null,
            from: "user@snoogle.com",
            to: null,
            labels: [],
            isStarred: false
          },
          {
            id: "d6048143ffff",
            createdAt: 1701163674522,
            subject: "Cool",
            body: "Sent.",
            isRead: true,
            sentAt: 1701163815187,
            removedAt: null,
            from: "yara@greenworld.org",
            to: "user@snoogle.com",
            labels: [],
            isStarred: false
          },
          {
            id: "0b195d3f6ce6",
            createdAt: 1683391861522,
            subject: "Guidelines for submitting your travel receipts",
            body: "Hey,\n\nAttached are the slides and transcript from last week's workshop. Feel free to share with anyone who missed it.\n\nCheers,\nJordan",
            isRead: true,
            sentAt: 1683392090789,
            removedAt: null,
            from: "team@clarifyhub.net",
            to: "user@snoogle.com",
            labels: [],
            isStarred: false
          }
    
    ]

    return mails
} 
