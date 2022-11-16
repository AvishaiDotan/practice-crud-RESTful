const express = require('express')
const cookieParser = require('cookie-parser')

const bugService = require('./services/bug.service')
const userService = require('./services/user.service')

const app = express()

// Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())


// Get Requests
app.get('/api/bug', (req, res) => {
    const { title, page } = req.query

    const filterBy = {
        title: title || '',
        page: +page || 0
    }

    bugService.query(filterBy)
        .then(data => res.send(data))
})

app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.getById(bugId)
        .then((bug) => { res.send(bug) })
})

// Post
app.post('/api/bug/', (req, res) => {

    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add car')

    const bug = { ...req.body, creator: loggedinUser, createdAt: Date.now() }

    bugService.save(bug)
        .then(savedBug => {
            res.send(savedBug)
        })
})

//Put
app.put('/api/bug/:id', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) {
        return res.status(401).send('Cannot add car')
    }

    if (!loggedinUser.username === 'ADMIN' && loggedinUser._id !== req.body.creator._id) {
        return res.status(401).send('Cannot update car')
    }

    const bug = { ...req.body }

    bugService.save(bug)
        .then(savedBug => {
            res.send(savedBug)
        })
        .catch(err => err)
})

app.delete('/api/bug/:bugId', (req, res) => {

    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) {
        return res.status(401).send('Cannot add car')
    }

    if (!loggedinUser.username === 'ADMIN' && loggedinUser._id !== req.body.creator._id) {
        return res.status(401).send('Cannot update car')
    }

    const { bugId } = req.params

    bugService.remove(bugId)
        .then(() => {
            res.send('deleted')
        })
})


app.get('/api/bug/downloadPdf', (req, res) => {
    bugService.query().then((result) => {
        bugService.downloadPdf(result)
            .then(() => {
                res(result)
            })
            .catch(err => err)

    })
})

app.get('/api/bug/:bugId', (req, res) => {

    const { bugId } = req.params

    const visitedBugs = req.cookies.visitedBugs || []

    if (!visitedBugs.includes(bugId)) {
        visitedBugs.push(bugId)
        console.log('visited bugs', visitedBugs);
    }

    if (visitedBugs.length >= 3) {
        return res.status(401).send('hold on you are magzim')
    }

    bugService.getById(bugId)
        .then(bug => {
            res.cookie('visitedBugs', visitedBugs, { maxAge: 1000 * 7 })
            res.send(bug)
        })

})

// Logout
app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged out')
})

// Signup
app.post('/api/auth/signup', (req, res) => {
    userService.save(req.body)
        .then(user => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
})

//LOGIN
app.post('/api/auth/login', (req, res) => {
    userService.checkLogin(req.body)
        .then(user => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch((err) => {
            res.status(401).send(err)
        })
})

//Get User
app.get('/api/user/bugs', (req, res) => {

    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('No User Connected')

    bugService.queryByUserId(loggedinUser._id)
        .then(bugs => res.send(bugs))
        .catch(err => {
            console.log(err)
            res.status(401).send(err)
        })
})

app.delete('/api/user/:userId', (req, res) => {

    const { userId } = req.params

    bugService.queryByUserId(userId)
        .then(bugs => {
            if (!bugs.length) {
                userService.remove(userId)
                    .then(() => {
                        res.send('deleted')
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(401).send(err)
                    })
            } else {
                res.status(401).send('Has Bugs')
            }
        })
        .catch(err => {
            console.log(err)
            res.status(401).send(err)
        })
})

app.get('/api/user', (req, res) => {

    userService.getUsers()
        .then(users => res.send(users))
        .catch(err => console.log(err))
})


const PORT = process.env.PORT || 3030

app.listen(PORT, () => console.log(`Server ready at port ${PORT}`))

