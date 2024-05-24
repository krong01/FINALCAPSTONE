  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import { useParams } from 'react-router-dom';
  import ReactQuill from 'react-quill';
  import 'react-quill/dist/quill.snow.css';

  function AdminCreateEvent() {
    const { adminID } = useParams(); 

    const [eventTitle, setEventTitle] = useState('');
    const [eventStart, setEventStart] = useState('');
    const [eventEnd, setEventEnd] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [eventID, setEventID] = useState(null); 
    const [message, setMessage] = useState('');
    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState('');
  

    useEffect(() => {
      axios.get('http://localhost:8080/getAllSections')
        .then(response => {
          setSections(response.data);
        })
        .catch(error => {
          console.error('Error fetching sections:', error);
        });
    }, []);

    const assignedSectionsIds=[];
  

    const handleEventTitleChange = (event) => {
      setEventTitle(event.target.value);
    };

    const handleEventStartChange = (event) => {
      const date = new Date(event.target.value);
      const formattedDate = date.toISOString().split('T')[0]; 
      setEventStart(formattedDate);
    };

    const handleEventEndChange = (event) => {
      const date = new Date(event.target.value);
      const formattedDate = date.toISOString().split('T')[0]; 
      setEventEnd(formattedDate);
    };

    const handleDescriptionChange = (event) => {
      setDescription(event);
    };

    const handleImageChange = (event) => {
      setImage(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
      event.preventDefault();

      try {
        const formData = new FormData();
        formData.append('eventTitle', eventTitle);
        formData.append('eventStart', eventStart);
        formData.append('eventEnd', eventEnd);
        formData.append('image', image);
        formData.append('description', description);

        const response = await axios.post(
          'http://localhost:8080/events',
          formData,
        );

        setEventID(response.data.eventID);
        setEventTitle('');
        setEventStart('');
        setEventEnd('');
        setDescription('');
        setImage(null);
        setErrorMessage('');
      } catch (error) {
        console.error('Error creating event:', error);
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data);
        } else {
          setErrorMessage('An unexpected error occurred.');
        }
      }
    };

    const EventIDModal = () => {
      return (
        <div className="create-event-section-modal">
          <div className="create-event-section-modal-content">
            <span className="CES-close" onClick={() => setEventID(null)}>&times;</span>
            <p>Event ID: {eventID}</p>
            <div>
              <label htmlFor="sectionSelect">Select Section:</label>
              <select
                id="sectionSelect"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option value="">Select Section</option>
                {sections.map((section, index) => (
                  !assignedSectionsIds.includes(section.id) && (
                    <option key={index} value={section.id}>
                      {section.sectionName} 
                    </option>
                  )
                ))}
              </select>
            </div>
            <button onClick={handleSubmitEvent}>Assign Section</button>
            {message && <p>{message}</p>}
          </div>
        </div>
      );
    };

    const handleSubmitEvent = async () => {
      try {
        const requestData = {
          event: {
            eventID: eventID, 
            eventTitle: eventTitle,
            eventStart: eventStart,
            eventEnd: eventEnd,
            image: null, 
            description: description
          },
          section: {
            id: selectedSection, 
            sectionName: selectedSection, 
          }
        };

        const response = await axios.post('http://localhost:8080/assignSectionToEvent', requestData);
      
       alert("Section assigned to event successfully.");
      } catch (error) {
        setMessage('Failed to assign teacher to event');
        console.error(error);
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
      <section className='create-event'> 
      <div className='create-event-container'>
        <h1>Create Event</h1>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <form className='form create-event-form' onSubmit={handleSubmit}>

          <div className="create-event-form-row">
            <input type="text" value={eventTitle} placeholder='  Event Title' onChange={handleEventTitleChange} required />
            <input type="date" value={eventStart} onChange={handleEventStartChange} required/>
            <input type="date" value={eventEnd} onChange={handleEventEndChange} required/>
          </div>
            <ReactQuill value={description} onChange={handleDescriptionChange} modules={modules} formats={formats} autoFocus/>
            <input className='create-event-add-img' type="file" accept="image/png, image/jpeg" onChange={handleImageChange} />
            <button className='create-event-btn' type="submit">Create Event</button>
        </form>
        {eventID && <EventIDModal />}
      </div>
      </section>
    );
  }

  export default AdminCreateEvent;

