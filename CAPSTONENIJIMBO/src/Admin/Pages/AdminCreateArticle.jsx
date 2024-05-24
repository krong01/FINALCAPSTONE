import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Link } from 'react-router-dom';
import './adminArticles.css'

function AdminCreateArticle() {
  const { adminID } = useParams();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [date, setDate] = useState('');
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  
  const handleCloseModal = () => {
    setSuccessModalOpen(false);
  };

  const handleDate = (event) =>{
    const date = new Date(event.target.value);
    const formattedDate = date.toISOString().split('T')[0]; 
    console.log(formattedDate)
    setDate(formattedDate);
  }


  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('image', image);
      formData.append('date', date);
      formData.append('adminID', adminID);

      const response = await axios.post(
        'http://localhost:8080/articles/createart',
        formData,
        
      );

      const createdArticle = response.data; 
      console.log(createdArticle);
      setTitle('');
      setDescription('');
      setImage(null);
      setErrorMessage('');
      setSuccessModalOpen(true);
    } catch (error) {
      console.error('Error creating article:', error);
      setErrorMessage(error.response.data.message); 
    }
  };

  const modules = {
    toolbar: [
      [{ 'header':[1,2,3,4,5,6, false]}],
      [ 'bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];





  return (
    <section className='create-article'> 
    <div className='create-article-container'>
      <h1>Create Article</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form className='form create-article-form' onSubmit={handleSubmit}>
        <div className="create-article-form-row">
          <input type="text" value={title} placeholder='  Article Title' onChange={handleTitleChange} required />
          <input type="date" value={date} onChange={handleDate} required/>
        </div>
        <div className="create-article-description">
          <ReactQuill defaultValue={description} onChange={setDescription} modules={modules} formats={formats} autoFocus/>
          </div>
          <button className='create-article-btn' type="submit">Create Article</button>
      </form>
      
      {successModalOpen && (
      <div className="created-article-modal">
          <div className="create-article-modal-content">
          <Link to={`/Admin/Articles/${adminID}`}>
          <span className="created-article-close" onClick={handleCloseModal}>&times;</span>
          </Link>
          <p className='created-article-message'>Article successfully created!</p>
      </div>
</div>
)}
    </div>
    </section>
  );
}

export default AdminCreateArticle;