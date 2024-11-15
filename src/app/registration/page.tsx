"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import NavBar from '../navbar';

interface ResponseType {
  studentID: number;
  name: string;
  grade: number;
  school: string;
  parentemail: string;
  studentemail: string;
  constant: number;
}

export default function DisplayForm() {
  const [formData, setFormData] = useState<ResponseType>({
    studentID: 0,
    name: '',
    grade: 0,
    school: '',
    parentemail: '',
    studentemail: '',
    constant: 1,
  });
  const [response, setResponse] = useState<ResponseType | null>(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false); // Track submission state

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('https://vvq9yn8c3m.execute-api.us-west-2.amazonaws.com/dev/latest-student', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      let recentStudent = await response.json();
      console.log('Recent Student:', recentStudent);
      const newID = recentStudent.data.studentID + 1;
      console.log('New Student ID:', newID);

      // Update formData with the new student ID using a callback to ensure it's the latest state
      setFormData(prevFormData => {
        return { ...prevFormData, studentID: newID };
      });

      setIsFormSubmitted(true); // Flag to trigger form submission after state update
    } catch (error) {
      console.error('Error getting latest student:', error);
    }
  };

  // useEffect to handle form submission after state has been updated
  useEffect(() => {
    if (isFormSubmitted) {
      const submitForm = async () => {
        console.log('Submitting form:', JSON.stringify(formData));
        try {
          const res = await fetch('https://vvq9yn8c3m.execute-api.us-west-2.amazonaws.com/dev/registration', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
          const data: ResponseType = await res.json();
          setResponse(data); // Display the response data
        } catch (error) {
          console.error('Error submitting form:', error);
        }
      };

      submitForm();
      setIsFormSubmitted(false); // Reset flag after submission
    }
  }, [isFormSubmitted, formData]); // Effect will run when formData changes

  return (
    <div>
      <NavBar />
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
        <input name="grade" placeholder="Grade" value={formData.grade} onChange={handleChange} />
        <input name="school" placeholder="School" value={formData.school} onChange={handleChange} />
        <input name="parentemail" placeholder="Parent Email" value={formData.parentemail} onChange={handleChange} />
        <input name="studentemail" placeholder="Student Email" value={formData.studentemail} onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
      {response && (
        <div>
          <h3>Submitted Data:</h3>
          <p>Name: {response.name}</p>
          <p>Grade: {response.grade}</p>
          <p>School: {response.school}</p>
          <p>Parent Email: {response.parentemail}</p>
          <p>Student Email: {response.studentemail}</p>
        </div>
      )}
    </div>
  );
}
