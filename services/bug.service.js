const fs = require('fs')
const { promises } = require('stream')
const PDFDocument = require('pdfkit');

let gBugs = require('../data/bugs.json');
const { log } = require('console');


module.exports = {
    query,
    getById,
    remove,
    save,
    downloadPdf,
    queryByUserId
}

function queryByUserId(userId) {
    return new Promise((resolve, reject) => {
        const filteredBugs = gBugs.filter(bug => bug.creator._id === userId)
        resolve(filteredBugs)
    })
}

function query(filterBy) {
    const bugsPerPage = 3
    const { title, page } = filterBy
    return new Promise((resolve, reject) => {
        // let bugs = require('../data/bugs.json')

        const regex = RegExp(title, 'i')
        let filteredBugs = gBugs.filter(bug => regex.test(bug.title))
        
        const startIdx = page * bugsPerPage
        const totalPages = Math.ceil(filteredBugs.length / bugsPerPage)

        filteredBugs = filteredBugs.slice(startIdx, startIdx + bugsPerPage)

        resolve({filteredBugs, totalPages})
    })
}

function remove(bugId) {
    const idx = gBugs.findIndex(bug => bug._id === bugId)
    gBugs.splice(idx, 1)
    return _saveBugsToFile()
}

function getById(bugId) {
    return new Promise((resolve, reject) => {
        const bug = gBugs.find(bug => bug._id === bugId)
        resolve(bug)
    })
}

function save(bug) {
    if (bug._id) {
        const idx = gBugs.findIndex(currBug => currBug._id === bug._id)
        gBugs[idx] = bug
    } else {
        bug._id = _makeId()
        gBugs.unshift(bug)
    }
    return _saveBugsToFile().then(() => bug)
}

function downloadPdf(bugs) {
    const doc = new PDFDocument;
    doc.pipe(fs.createWriteStream('./downloads/file.pdf'))

    bugs.forEach(bug => {
        doc.fontSize(18)
        doc.font('Times-Bold')
        doc.text(bug.title.toUpperCase())
        doc.moveDown()
        doc.fontSize(12)
        doc.font('Times-Roman')
        doc.text(bug.desc)
        doc.moveDown()
        doc.fontSize(15)
        doc.font('Times-Italic')
        doc.text(bug.severity)
        doc.moveDown(4)
    })

    doc.end()
    return Promise.resolve()
}



function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(gBugs, null, 2)

        fs.writeFile('data/bugs.json', data, (err) => {
            if (err) reject(err)
            resolve()
        })
    })
}


function _makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

