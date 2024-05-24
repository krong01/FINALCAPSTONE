import React, { useState, useEffect } from 'react';
import './AdminEvents.css';
import axios from 'axios';
import QrReader from 'react-qr-scanner';
import ReactQuill from 'react-quill';
import * as MdIcon from "react-icons/md";
import * as FaIcon from "react-icons/fa";
import { FaPeopleRoof } from "react-icons/fa6";
import { FiPlusSquare } from "react-icons/fi";

const AdminEventContent = () => {
  const [events, setEvents] = useState([]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [delay] = useState(100);
  const [scannedData, setScannedData] = useState(''); 
  const [selectedEventId, setSelectedEventId] = useState(null); 
  const [userId, setUserId] = useState(null);
  const [studentInfo, setStudentInfo] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedEventTitle, setSelectedEventTitle] = useState('');
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false); 
  const [eventToDelete, setEventToDelete] = useState(null); 
  const [eventDetailsModalOpen, setEventDetailsModalOpen] = useState(false); 
  const [editModalIsOpen, setEditModalIsOpen] = useState(false); 
  const [eventSections, setEventSections] = useState([]);
  const [showSectionsModalOpen, setShowSectionsModalOpen] = useState(false);
  const [addSectionModalOpen, setAddSectionModalOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [allSections, setAllSections] = useState([]);

  const handleDeleteSection = async (sectionId) => {
    try {
      const response = await axios.delete(`http://localhost:8080/deleteeventsection/${selectedEventId}/${sectionId}`);
      console.log('Section deleted:', response.data);
      setEventSections(eventSections.filter(section => section.section.id !== sectionId));
      alert('Section removed from event successfully');
    } catch (error) {
      console.error('Error deleting section:', error);
    }
  };
  const fetchSections = async () => {
    try {
      const response = await axios.get('http://localhost:8080/getAllSections');
      setAllSections(response.data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };
  const handleShowSections = async (eventId) => {
    try {
      const response = await axios.get(`http://localhost:8080/sectionevent/${eventId}`);
      setEventSections(response.data);
      setShowSectionsModalOpen(true);
      console.log(eventSections);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }finally{
      setShowSectionsModalOpen(true); 
    }
  };


  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  const [editEventData, setEditEventData] = useState({
    eventTitle: '',
    description: '',
    eventStart: '',
    eventEnd: ''
  });
  const openAddSectionModal = () => {
    setAddSectionModalOpen(true);
    fetchSections();
  };

  const handleModalClose = () => {
    setScannedData('');
    setStudentInfo(null);
    setModalIsOpen(false);
    setEventDetailsModalOpen(false);
    setShowSectionsModalOpen(false);
  };


  const handleScan = (data) => {
    if (data) {
      setScannedData(data.text);
    }
  }
  const modules = {
    toolbar: [
      [{ 'header':[1,2,3,4,5,6, false]}],
      [ 'bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ]
  const handleError = (err) => {
    console.error(err);
  }

  useEffect(() => {
    axios.get('http://localhost:8080/getEvents')
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  }, []);

  const getByStudentID = async (studentID) => {
    try {
      const response = await axios.get(`http://localhost:8080/getByStudentID/${studentID}`);
      setUserId(response.data.userid);
      setStudentInfo(response.data);
      
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  useEffect(() => {
    if (scannedData) {
      getByStudentID(scannedData);
    }
  }, [scannedData]);

  const handleEventClick = async (eventId, eventTitle) => {
    console.log("Event clicked:", eventId, eventTitle);
    setSelectedEventId(eventId);
    setSelectedEventTitle(eventTitle);
    setEventDetailsModalOpen(true);
    try {
      const response = await axios.get(`http://localhost:8080/getByEventid/${eventId}`);
      setSelectedEventDetails(response.data);
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
  };

  const handleUpdateTime = () => {
    axios.post(`http://localhost:8080/${selectedEventId}/${userId}/update-time`)
      .then(response => {
        console.log(response.data);
        setMessage(response.data);
        setStudentInfo(true); // Corrected line
        setTimeout(() => {
          setStudentInfo([]);
        }, 1000); // Clear studentInfo after 1 second
      })
      .catch(error => {
        console.error('Error updating time:', error);
      });
  };
  
  const handleDeleteEvent = async () => {
    try {
      await axios.delete(`http://localhost:8080/deleteByEventID/${eventToDelete}`);
      await axios.delete(`http://localhost:8080/studentdeleteByEventID/${eventToDelete}`);
      await axios.delete(`http://localhost:8080/deleteevent/${eventToDelete}`);
      setEvents(events.filter(event => event.eventID !== eventToDelete));
      setDeleteModalIsOpen(false);
      setEventDetailsModalOpen(false); 
      alert('Event successfully Deleted!');
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const openDeleteModal = (eventId) => {
    setEventToDelete(eventId);
    setDeleteModalIsOpen(true);
    console.log(eventId);
  };

  const closeDeleteModal = () => {
    setDeleteModalIsOpen(false);
    setEventToDelete(null);

  };
  const handleAddSection = async () => {
    try {
      if (!selectedSectionId) {
        console.error('Selected section ID is null');
        return; 
      }
      const newSection = {
        event: {
          eventID: selectedEventId,
          eventTitle: '', 
          eventStart: '', 
          eventEnd: '',
          image: '', 
          description: '' 
        },
        section: {
          id: selectedSectionId, 
          sectionName: '' 
        }
      };

      const response = await axios.post('http://localhost:8080/eventsection', newSection);
      console.log('Section added:', response.data);
      setEventSections([...eventSections, response.data]);
      alert('Section Added to Event Successfully');
      setAddSectionModalOpen(false);
      setSelectedSectionId(null); 

    } catch (error) {
      console.error('Error adding section:', error);

    }
  };

  const handleOpenQrModal = () => {
    setEventDetailsModalOpen(false);
    setModalIsOpen(true);
  };
  const handleOpenEditModal = () => {
    setEditModalIsOpen(true);
    setEditEventData({
      eventTitle: selectedEventDetails.eventTitle,
      description: selectedEventDetails.description,
      eventStart: formatDateForInput(selectedEventDetails.eventStart),
  eventEnd: formatDateForInput(selectedEventDetails.eventEnd)
    });
  };
  const handleEditEvent = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/updateevent/${selectedEventId}`, editEventData);
      console.log('Event updated:', response.data);
      setEditModalIsOpen(false); 
      alert('Event details updated successfully!');
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };
  const handleEditModalClose = () => {
    setEditModalIsOpen(false);
  };

  const handleSectionModalClose = () => {
    setShowSectionsModalOpen(false);
  };
  const filteredSections = allSections.filter(
    section => !eventSections.some(eventSection => eventSection.section.id === section.id)

);

const truncateDescription = (description, maxLength) => {
  if (description.length > maxLength) {
    return description.substring(0, maxLength) + '...';
  }
  return description;
};


  return (
    <section>
       {console.log('Filtered sections:', filteredSections)}
      {console.log('Selected section ID:', selectedSectionId)}
      <div className="admin-events">
        <ul>
          {events.slice().reverse().map(event => (
            <article key={event.eventID} className="admin-event" onClick={() => handleEventClick(event.eventID, event.eventTitle)}>
              <div className='admin-event-image'>
                <img src={`data:image/png;base64,${event.image}`} alt={event.eventTitle} />
              </div>
              <div className='admin-event-content'>
                <h1>{event.eventTitle}</h1>
                <p>Start Date: {event.eventStart}</p>
                <p>End Date: {event.eventEnd}</p>
                <p dangerouslySetInnerHTML={{ __html: truncateDescription(event.description, 100) }}></p>
              </div>
            </article>
          ))}
        </ul>
        {eventDetailsModalOpen && (
          <div className="announcement-modal">
            <div className="admin-announcement-modal">
              <span className="admin-announcement-closeButton" onClick={handleModalClose}>&times;</span>
              <div className='event-select-section-btn-action'>
              <button  className="event-select-section-btn" onClick={() => handleShowSections(selectedEventId)}><FaPeopleRoof /></button>
              <button className="event-select-section-btn" onClick={handleOpenEditModal}><FaIcon.FaEdit /></button>
              <button className="event-select-section-btn" onClick={() => openDeleteModal(selectedEventId)}><MdIcon.MdOutlineDeleteForever /></button>
              <button className= "event-select-section-btn" onClick={handleOpenQrModal}><MdIcon.MdOutlineQrCode /></button>

              </div>
              
              {selectedEventDetails && (
                <div>
                
          <div className='admin-announcement-modal-content'>
          <div className='admin-announcement-content'>
          <div className='announcement-image'>
            {selectedEventDetails.image && (
              <img src={`data:image/png;base64,${selectedEventDetails.image}`} alt="Event" />
            )}
          </div>
          <h1> {selectedEventTitle}</h1>
                  <p>{selectedEventDetails.eventStart}</p>
                  <p>{selectedEventDetails.eventEnd}</p>
                  <p  dangerouslySetInnerHTML={{ __html: selectedEventDetails.description }} ></p>
                </div>
                </div>
                </div>
              )}
            
              
            </div>
          
          </div>
        )}

      <div>
      {modalIsOpen && (
        <div className="event-modal">
          <div className="event-modal-content">
            <span className="AE-close" onClick={handleModalClose}>&times;</span>
            <h1> {selectedEventTitle} Attendance</h1>
            <div className='event-content'>
              <div className='event-qr-code' >
                <QrReader
                  delay={delay}
                  onError={handleError}
                  onScan={handleScan}
                />
              </div>
              <div className="studentinfo">
              <div className='event-attendance-input'>
              <input
                type="text"
                value={scannedData}
                onChange={(e) => setScannedData(e.target.value)}
                placeholder="Manually input Student ID"
              />
              <button className="event-attendance-button" onClick={handleUpdateTime}>Update Time</button>
            </div>
              {studentInfo && (
                <div className='event-student-details'>
                  <h1>Student Information</h1>
                  
                  <img src={`data:image/png;base64,${studentInfo.profile}`} alt={studentInfo.firstName} />
                  <h1>{studentInfo.firstName} {studentInfo.lastName}</h1>
                  <h1>{message}</h1>
                  
                </div>
              )}
               </div>
            </div>
           

          </div>
        </div>
      )}
      {deleteModalIsOpen && (
          <div className="announcement-delete-modal">
            <div className="announcement-delete-modal-content">
              <h1 className='announcement-deleteTitle'>Confirm Deletion</h1>
              <p>Are you sure you want to delete this event?</p>
              <div className="announcement-deleteOptions">
              <button className="announcement-confirmDelete" onClick={handleDeleteEvent} >Yes</button>
              <button className="announcement-cancelDelete" onClick={closeDeleteModal} >No</button>
            </div>
          </div>
          </div>
        )}
      </div>
      </div>
      
      {editModalIsOpen && (
          <div className="article-edit-modal">
            <div className="article-modal-content-edit">
              <span className="event-edit-closeButton" onClick={handleEditModalClose}>&times;</span>
              <h1 className='article-edittitle'>Edit Event</h1>
              <div className='inputs'>
       
              <input
                className='article-title'
                type="text"
                value={editEventData.eventTitle}
                onChange={(e) => setEditEventData({ ...editEventData, eventTitle: e.target.value })}
                placeholder="Event Title"
              />
              <div className='event-date'>
                   <p>Event Start</p>
               <input
                type="date"
                value={editEventData.eventStart.substr(0,10)}
                onChange={(e) => setEditEventData({ ...editEventData, eventStart: e.target.value })}
              />
              
              <p> Event End</p>
              <input
  type="date" 
  value={editEventData.eventEnd.substr(0, 10)} 
  onChange={(e) => setEditEventData({ ...editEventData, eventEnd: e.target.value })}
/>
              </div>
              <ReactQuill
  value={editEventData.description || ''}
  onChange={(value) => setEditEventData({ ...editEventData, description: value })}
  placeholder="Description"
  modules={modules}
  formats={formats}
  required
/>
             
              <button className="create-announcement-btn" onClick={handleEditEvent}>Save</button>
            </div>
          
          </div>
          </div>
        )}
        
        {showSectionsModalOpen && (
  <div className="event-select-section-modal">
    <div className="event-select-section-modal-content">
      <span className="AE-close" onClick={handleSectionModalClose}>&times;</span>
      <div className='admin-announcement-actions'>
      <button className="event-select-section-btn" onClick={openAddSectionModal}><FiPlusSquare /></button>
      </div>
      <h3> Sections for {selectedEventTitle}</h3>

      <div className="event-select-section-list-content">
      {eventSections.length === 0 ? (
        <p>No sections assigned</p>
      ) : (
        eventSections.map(section => (
                            <div key={section.id} className="event-select-section-container">
                                <p>{section.section.sectionName}</p>
                                <button onClick={() => handleDeleteSection(section.section.id)}>&times;</button>
                            </div>
        ))
      )}
</div>
      
    
    </div>
  </div>
)}
{addSectionModalOpen && (
  <div className="announcement-delete-modal">
    <div className="announcement-delete-modal-content">
      <span className="AE-close" onClick={() => setAddSectionModalOpen(false)}>&times;</span>
      <h3>Add Section to Event {selectedEventDetails.eventTitle}</h3>
      <div>
        <label htmlFor="section-select">Select Section:</label>
        <select
          id="section-select"
          value={selectedSectionId}
          onChange={(e) => setSelectedSectionId(e.target.value)}
        >
           <option value="">...</option>  
            {filteredSections.map(section => (
                            <option key={section.id} value={section.id}>
                                {section.sectionName}
                            </option>
                        ))}
        </select>
      </div>
      <button className='create-announcement-btn' onClick={handleAddSection}>Add Section</button>
    </div>
  </div>
)}
    </section>
  );
};

export default AdminEventContent;


  