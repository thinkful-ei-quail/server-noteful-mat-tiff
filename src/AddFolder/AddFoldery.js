import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
//import {withRouter} from 'react-router-dom'
import config from '../config'
import './AddFolder.css'

export default class AddFolder extends Component {
  static defaultProps = {
    history: {
      push: () => { }
    },
    handleAddFolder: () => {}
  }
  static contextType = ApiContext;

state = {
  error: null,
}

  // validateName(){
  //   const {value, touched}  = this.state.name;
  //   const {folders} = this.context;
  //   return (
  //     typeof value === 'string' &&
  //     value.length > 0 &&
  //     touched && 
  //     !folders.find(
  //       (folder) =>
  //       folder.name && folder.name.toLowerCase() === value.toLowerCase()
  //     )
  //   );
  // }

  handleSubmit = e => {
    e.preventDefault()
    const { name } = e.target
    const newFolder = { name: name.value }
    this.setState({ error: null })
    fetch(`${config.API_ENDPOINT}/folders`, {
      method: 'POST',
      body: JSON.stringify(newFolder),
      headers: {
        'content-type': 'application/json'
      }
    })
    .then( data => {
      name.value = ''
      this.props.handleAddFolder(data)
    })
    .catch(error => {
      this.setState({ error })
    })
  }

  render() {
    return (
      <section className='AddFolder'>
        <h2>Create a folder</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='folder-name-input'>
              Name
            </label>
            <input type='text' id='folder-name-input' name='folder-name' />
          </div>
          <div className='buttons'>
            <button type='submit'>
            {/* disables={!this.validateName()} type='submit' className='submit-new-folder'> */}
              Add folder
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}

// export default withRouter(AddFolder);