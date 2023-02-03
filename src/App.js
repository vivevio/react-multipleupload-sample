import './App.css';
import { useState } from 'react';
import axios from 'axios';
import { API_HOST } from './config';

function InputTypeVideoExternal({value, onChange=()=>{}}) {
  return (
    <>
      <label><b>Video URL</b></label>
      <input type="text" value={value} onChange={onChange} />
    </>
  )
}

function InputTypeVideoUpload({onChange=()=>{}}) {
  return (
    <>
      <label><b>Video URL</b></label>
      <input type="file" accept='video/mp4' onChange={onChange} />
    </>
  )
}

function InputTypeMediaInteractive({onChange=()=>{}}) {
  return (
    <>
      <label><b>Select Directory</b></label>
      <input type="file" directory="" webkitdirectory="" multiple onChange={onChange} />
    </>
  )
}

function App() {

  const [formData, setFormData] = useState({
    name: '',
    type: 'video_external',
    media_url: '' 
  });

  const [mediaFile, setMediaFile] = useState('')

  const handleChangeType = (e) => {
    setFormData({...formData, type:e.target.value})
  }

  const onUploadVideoSelected = (e) => {
    setMediaFile(e.target.files[0])
  }

  const onUploadMediaSelected = (e) => {
    let files = e.target.files
    setMediaFile(e.target.files)
  }


  const onSave = async (e) => {
    e.preventDefault()
    const data = new FormData();
    data.append('name', formData.name)
    data.append('type', formData.type)

    if(['video_internal'].indexOf(formData.type) >= 0) data.append('mediaBinary', mediaFile)

    // if(['media'].indexOf(formData.type) >= 0) data.append('file', mediaFile)
    if(['media'].indexOf(formData.type) >= 0) {
      Array.from(mediaFile).forEach((file, index) => {
        data.append('mediaBinaries', file)
      })
    }

    let reqOptions = {
        url: API_HOST,
        method: "post",
        headers: {
            "Accept": "*/*",
            'Content-Type': 'multipart/form-data',
            "Access-Control-Allow-Origin": "*"
        },
        data,
    }
    
    return axios.request(reqOptions).catch(function(error){
      console.log(error)
    });
  }

  return (
    <div className="App">
      <form action="">
        <h1>Subject Matter</h1>
        <div className='form-group'>
          <label><b>Name</b></label>
          <input type="url" value={formData.name} onChange={(e)=> setFormData({...formData, name: e.target.value})}  />
        </div>
        <div className='form-group'>
          <label><b>Type</b></label>
          <select name="type" onChange={handleChangeType}>
            <option value="video_external">Embed Video</option>
            <option value="video_internal">Upload Video</option>
            {/* <option value="audio">Audio</option> */}
            {/* <option value="image">Image</option> */}
            {/* <option value="pdf">PDF</option> */}
            {/* <option value="link">Link</option> */}
            <option value="media">Media/Interactive HTML</option>
            {/* <option value="office">Office(PPT, Docx)</option> */}
          </select>
        </div>

        <div className='form-group'>
          { formData.type == 'video_external' && <InputTypeVideoExternal value={formData.media_url} onChange={(e)=> setFormData({...formData, media_url: e.target.value})} /> }
          { formData.type == 'video_internal' && <InputTypeVideoUpload onChange={onUploadVideoSelected} /> }
          { formData.type == 'media' && <InputTypeMediaInteractive onChange={onUploadMediaSelected} /> }
        </div>

        <button onClick={onSave}>Save Subject</button>
      </form>
    </div>
  );
}

export default App;
