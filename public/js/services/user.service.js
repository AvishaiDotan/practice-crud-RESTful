const LOGGEDIN_USER_KEY = 'userDB'

export const userService = {
    getLoggedInUser,
    signup,
    logout,
    login,
    getUserDetails,
    getUserBugs,
    getUsers,
    remove
}

function getLoggedInUser() {
    return JSON.parse(sessionStorage.getItem(LOGGEDIN_USER_KEY))
}

function signup({ username, password, fullname }) {
    const user = { username, password, fullname }

    return axios.post('/api/auth/signup', user)
        .then(res => res.data)
        .then(user => {
            return setLoggedinUser(user)
        })
}

function logout() {
    return axios.post('/api/auth/logout')
        .then((res) => {
            sessionStorage.removeItem(LOGGEDIN_USER_KEY)
            return res.data
        })
        .catch(err => res)
}

function setLoggedinUser(user) {
    const userToSave = { _id: user._id, fullname: user.fullname }
    sessionStorage.setItem(LOGGEDIN_USER_KEY, JSON.stringify(userToSave))
    return userToSave
}

function login({ username, password }) {
    return axios.post('/api/auth/login', { username, password })
        .then(res => res.data)
        .then(user => {
            return setLoggedinUser(user)
        })

}

function getUserDetails() {
    const user = JSON.parse(sessionStorage.getItem(LOGGEDIN_USER_KEY))
    return user
}

function getUserBugs() {
    return axios.get('/api/user/bugs')
        .then(res => res.data)
        .catch(err => console.log(err))
}

function getUsers() {
    return axios.get('/api/user/')
        .then(res => res.data)
        .catch(err => console.log(err))
}

function remove(userId) {
    return axios.delete('/api/user/' + userId).then(res => res)
  }