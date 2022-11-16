
const gUsers = require('../data/user.json')
const fs = require('fs')
const Cryptr = require('cryptr')

const cryptr = new Cryptr('secret-puk-1234')

module.exports = {
    save,
    getLoginToken,
    validateToken,
    checkLogin,
    getUsers,
    remove
}

function save(user) {
    if (user._id) {
        const idx = gUsers.findIndex((currUser) => currUser._id === user._id)
        gUsers[idx] = user
    } else {
        user._id = _makeId()
        gUsers.unshift(user)
    }
    return _saveUsersToFile().then(() => ({ _id: user._id, fullname: user.fullname }))
}

function getLoginToken(user) {
    return cryptr.encrypt(JSON.stringify(user))
}

function validateToken(loginToken) {
    try {
      const json = cryptr.decrypt(loginToken)
      const loggedinUser = JSON.parse(json)
      return loggedinUser
    } catch (err) {
      console.log('Invalid login token')
    }
    return null
  }

function checkLogin({ username, password }) {
    return new Promise((resolve, reject) => {

        let user = gUsers.find(user => user.username === username)

        if (!user) reject('No Loggin User')
        else if (user.password !== password) reject('Not Your Bug')
        
        user = { _id: user._id, fullname: user.fullname }
        resolve(user)
    })
}

function getUsers() {
    return new Promise((resolve, reject) => {
        resolve(gUsers)
    })
}

function remove(userId) {
    const idx = gUsers.findIndex(user => user._id === userId)
    gUsers.splice(idx, 1)
    return _saveUsersToFile()
}



function _saveUsersToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(gUsers, null, 2)

        fs.writeFile('data/user.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}







function _makeId(length = 5) {
    var txt = ''
    var possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}
