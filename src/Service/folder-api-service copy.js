import config from './config'

const FolderApiService = {
  getFolders() {
    return fetch(`${config.API_ENDPOINT}/folders`, {
        headers: {},
    })
    .then(data => 
        (!data.ok)
          ? data.json().then(e => Promise.reject(e))
          : data.json()
    )
  },
  getById(folderId) {
    return fetch(`${config.API_ENDPOINT}/folders/${folderId}`, {
        headers: {},
    })
    .then(data => 
        (!data.ok)
          ? data.json().then(e => Promise.reject(e))
          : data.json()
    )
  },
  deleteNote(folderId) {
    return fetch(`${config.API_ENDPOINT}/folders/${folderId}`, {
        headers: {},
    })
    .then(data => {
        if (!data.ok)
          Promise.reject(data)
        }
    )
  },
  postNote(folderId, title) {
    return fetch(`${config.API_ENDPOINT}/folders`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        folder_id: folderId,
        title,
      }),
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  },
  patchFolder (folderId, title) {
    return fetch(`${config.API_ENDPOINT}/folders/${folderId}`, {
      method: 'PATCH',
      headers: {
          'content-type': 'application/json',
      },
      body: JSON.stringify({
          folder_id: folderId,
          title,
      }),
    })
    .then(data =>
        (!data.ok)
          ? data.json().then(e => Promise.reject(e))
          : data.json()
    )
  }
}

export default FolderApiService