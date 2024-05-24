import React, { useState } from 'react';
import axios from 'axios'; 
import './AdminAddTeachers.css'

function AdminAddTeacher() {
    const [formData, setFormData] = useState({
        teacherID: '',
        firstName: '',
        lastName: '',
        assignedYear: '',
        email: '',
        password: '',
        profile:null
      });
    

    const [emailExists, setEmailExists] = useState(false);
    const [teacherIDExists, setTeacherIDExists] = useState(false);
      const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
      
        if (name === 'email') {
          try {
            const response = await axios.get(`http://localhost:8080/checkEmail/${value}`);
            setEmailExists(response.data);
          } catch (error) {
            console.error('Error checking email:', error);
          }
        } else if (name === 'teacherID') {
          try {
            const response = await axios.get(`http://localhost:8080/checkTeacherID/${value}`);
            setTeacherIDExists(response.data);
          } catch (error) {
            console.error('Error checking teacherID:', error);
          }
        }
      };
      const handleFileChange = (e) => {
        setFormData(prevState => ({
          ...prevState,
          profile: e.target.files[0] 
        }));
      };
    
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          if (emailExists) {
            alert('Email already exists. Please choose different credentials.');
            return;
        }
        if(teacherIDExists){
          alert('Teacher ID already exists. Please choose different credentials.');
          return;
        }
          const formDataToSend = new FormData();
          formDataToSend.append('teacherID', formData.teacherID);
          formDataToSend.append('firstName', formData.firstName);
          formDataToSend.append('lastName', formData.lastName);
          formDataToSend.append('assignedYear', formData.assignedYear);
          formDataToSend.append('email', formData.email);
          formDataToSend.append('password', formData.password);
          formDataToSend.append('profile', formData.profile);
      

          await axios.post('http://localhost:8080/createTeacher', formDataToSend);
      

          setFormData({
            teacherID: '',
            firstName: '',
            lastName: '',
            assignedYear: '',
            email: '',
            password: '',
            profile: null
          });
          alert('Teacher added successfully');
        } catch (error) {
          console.error('Failed to add teacher: ', error);
          alert('Failed to add teacher. Please try again.');
        }
      };
  return (
    <div className="add-teacher-container">
      <h1>Add Teacher</h1>
      <div className="add-teacher-content">
        <form onSubmit={handleSubmit}>
          <div className="add-teacher-user-details">
            <div className="add-teacher-input-box">
              <span className="add-teacher-details">First Name</span>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter Firstname"
                required
              />
            </div>
            <div className="add-teacher-input-box">
              <span className="add-teacher-details"> Last Name</span>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter Lastname"
                required
              />
            </div>
            <div className="add-teacher-input-box">
              <span className="add-teacher-details">Teacher ID</span>
              <input
                type="text"
                name="teacherID"
                value={formData.teacherID}
                onChange={handleChange}
                placeholder="Enter Teacher ID"
                required
              />
            </div>
            <div className="add-teacher-input-box">
              <span className="add-teacher-details">Assigned Year</span>
              <input
                type="text"
                name="assignedYear"
                value={formData.assignedYear}
                onChange={handleChange}
                placeholder="Assigned Year"
                required
              />
            </div>
            <div className="add-teacher-input-box">
              <span className="add-teacher-details">Email</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
           
            <div className="add-teacher-input-box">
              <span className="add-teacher-details">Password</span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="add-teacher-input-box">
              <span className="add-teacher-details">Profile Picture</span>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/png, image/jpeg"
                required
              />
            </div>
            
          </div>
          <div className="add-teacher-button">
            <input type="submit" value="Register" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminAddTeacher;