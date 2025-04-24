import express from 'express'
import cookieParser from 'cookie-parser'

const app = express()

//* Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())
app.set('query parser', 'extended')


app.get('/', (req, res) => res.send('Hello there'))






app.listen(3031, () => console.log('Server ready at port 3030'))
