import { storageService } from './async-storage-service.js'


const STORAGE_KEY = 'bugDB'

export const bugService = {
  query,
  getById,
  getEmptyBug,
  save,
  remove,
  downloadPdf
}

const BASE_URL = `/api/bug/`

function query(filterBy) {
  return axios.get(BASE_URL, { params: filterBy }).then(res => res.data)
}

function getById(bugId) {
  return axios.get(BASE_URL + bugId).then(res => res.data)
}

function getEmptyBug() {
  return   {
    _id: '',
    title: '',
    description: '',
    severity: 0,
    createdAt: 0,
    creator: {
      _id: '',
      fullname: '',
    }
  }
}

function remove(bugId) {
  return axios.delete(BASE_URL + bugId).then(res => res)
}

function save(bug) {
  if (bug._id) {
    return axios.put(BASE_URL + bug._id, bug)
        .then(res => res.data)
  } 
    
  else return axios.post(BASE_URL, bug).then(res => res.data)
}

function downloadPdf() {
  return axios.get(BASE_URL + 'downloadPdf').then(res => res)
    .catch(err => err)
}
