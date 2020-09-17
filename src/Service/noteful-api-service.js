import config from './config'

const NotefulApiService = {
  getNotes() {
    return fetch(`${config.API_ENDPOINT}/notes`, {
        headers: {},
    })
    .then(data => 
        (!data.ok)
          ? data.json().then(e => Promise.reject(e))
          : data.json()
    )
  },
  getById(noteId) {
    return fetch(`${config.API_ENDPOINT}/notes/${noteId}`, {
        headers: {},
    })
    .then(data => 
        (!data.ok)
          ? data.json().then(e => Promise.reject(e))
          : data.json()
    )
  },
  deleteNote(noteId) {
    return fetch(`${config.API_ENDPOINT}/notes/${noteId}`, {
        headers: {},
    })
    .then(data => {
        if (!data.ok)
          Promise.reject(data)
        }
    )
  },
  postNote(noteId, title, content) {
    return fetch(`${config.API_ENDPOINT}/notes`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        note_id: noteId,
        title,
        content,
      }),
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  },
  patchNote (noteId, title, content) {
    return fetch(`${config.API_ENDPOINT}/notes/${noteId}`, {
      method: 'PATCH',
      headers: {
          'content-type': 'application/json',
      },
      body: JSON.stringify({
          note_id: noteId,
          title,
          content
      }),
    })
    .then(data =>
        (!data.ok)
          ? data.json().then(e => Promise.reject(e))
          : data.json()
    )
  }
}

export default NotefulApiService