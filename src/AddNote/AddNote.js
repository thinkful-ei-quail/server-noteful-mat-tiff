import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import config from '../config'
import './AddNote.css'
import CircleButton from '../CircleButton/CircleButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class AddNote extends Component {
  // static defaultProps = {
  //   history: {
  //     push: () => { }
  //   },
  // }
  static contextType = ApiContext;
  
  constructor(props){
    super(props);
    this.state = {
      name:{value:'', touched: false},
      content: {value:'',touched: false},
      folder:{value:''}
    };
  }

  updateName = (name) => {
    this.setState({name:{value:name,touched:true}});
  };

  updateContent = (content) => {
    this.setState({content:{value:content,touched:true}});
  };

  updateFolder = (id) => {
    this.setState({folder:{value:id,touched:true}});
  };

  renderFolderSelection =() => {
    return this.context.folders.map((folder) => {
      return (
        <option key={folder.id} value={folder.id}>
          {folder.name}
        </option>
      );
    });
  };

  validateName = () => {
    const{value,touched} = this.state.name;
    return typeof value === 'string' && value.length > 0 && touched;
  }

  validateFolder = () => {
    return this.state.folder.value
  };

  handleSubmit = e => {
    e.preventDefault()
    const {name,content,folder} = this.state;
    const newNote = JSON.stringify({
      name: name.value,
      content: content.value,
      folderId: folder.value,
      modified: new Date(Date.now()),
    });
    const options ={
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:newNote
    };
    fetch(`${config.API_ENDPOINT}/notes`, options)
      .then((res) => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
          return res.json()
      })
      .then((res) => {
        res.id = res.id.toString();
        this.content.AddNote(res);
        this.props.history.push('/')
      })
      .catch(error => {
        console.error({ error })
      })
  };

  renderAlt = () => {
    return ( 
      <>
        <h2>Please create a folder first</h2>
        <CircleButton tag={Link} to='/add-folder' type='button' className='NoteListNav__add-folder-button'>
          <FontAwesomeIcon icon='Plus' />
          <br />
          Folder
        </CircleButton>
        </>
    )
  };

  renderForm() {
    console.log(this.state.folder)
    return (
      <section className='AddNote'>
        <h2>Create a note</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='note-name-input'>
              Name: (required)
            </label>
            <input
              type='text' 
              id='note-name-input' 
              name='note-name' 
              //onChange={(e) => this.updateName()(e.target.value)}
            />
            {this.state.name.touched && !this.validateName() ? (
              <p>name is required</p>
            ) : null}
            )}
          </div>
          <div className='field'>
            <label htmlFor='note-content-input'>
              Content
            </label>
            <textarea 
              id='note-content-input' 
              name='note-content'
              onChange={(e) => this.updateContent(e.target.value)}
              aria-label="note content"
              placeholder="New note (content optional)"
              rows="14" 
              />
          </div>
          <div className='field'>
            <label htmlFor='note-folder-select'>
              Folder: (required)
            </label>
            <select 
              id='note-folder-select' 
              name='note-folder-id' 
              onChange={(e) => this.updateFolder(e.target.value)}
              >
              <option value="">Choose</option>
              {this.renderFolderSelection()}
            </select>
          </div>
          <div className='buttons'>
            <button 
              type='submit'
              disables={!this.validateName() || !this.validateFolder()}
              className="submit-new-folder"
            >
              Add note
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  };

  render() {
    return (
      <>
        {this.context.folders.length > 0 && this.renderForm()}
        {this.context.folders.length <= 0 && this.renderAlt()}
      </>
    )
  }
}

// export default withRouter(AddNote);
