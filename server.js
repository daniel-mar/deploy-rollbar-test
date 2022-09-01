const express = require('express')
// install cors and use it
const cors = require('cors');
const app = express()
const path = require('path')

app.use(express.json())
// use middleware cors
app.use(cors());

// added for rollbar
// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
    accessToken: 'e3af946af0134f44a41fad9f1382cdd8',
    captureUncaught: true,
    captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

const students = ['Jimmy', 'Timothy', 'Jimothy']

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
    //added
    rollbar.log('accessed html success');
})

app.get('/api/students', (req, res) => {
    res.status(200).send(students);
    rollbar.info('students loaded with info');
})

app.post('/api/students', (req, res) => {
    let { name } = req.body

    const index = students.findIndex(student => {
        return student === name
    })

    try {
        if (index === -1 && name !== '') {
            students.push(name)
            // comment, author of comment
            rollbar.log('added student nice', {author: 'daniel', typ: 'manuel'})
            res.status(200).send(students)
        } else if (name === '') {
            rollbar.error('no name entered')
            res.status(400).send('You must enter a name.')
        } else {
            rollbar.error('student is already here')
            res.status(400).send('That student already exists.')
        }
    } catch (err) {
        console.log(err)
    }
})

app.delete('/api/students/:index', (req, res) => {
    const targetIndex = +req.params.index

    rollbar.info('students deleted');

    students.splice(targetIndex, 1)
    res.status(200).send(students)
})

const port = process.env.PORT || 5050

app.listen(port, () => console.log(`Server listening on ${port}`))
