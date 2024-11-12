"use client";

import { useState, ChangeEvent, FormEvent } from 'react';

interface ResponseType {
  name: string;
  grade: number;
  school: string;
  parentemail: string;
  studentemail: string;
}

export default function DisplayForm() {
  const [formData, setFormData] = useState<ResponseType>({
    name: '',
    grade: 0,
    school: '',
    parentemail: '',
    studentemail: '',
  });
  const [response, setResponse] = useState<ResponseType | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitting form:', JSON.stringify(formData));
    try {
      const res = await fetch('https://vvq9yn8c3m.execute-api.us-west-2.amazonaws.com/dev/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      //console.log('Response Received');
      const data: ResponseType = await res.json();
      setResponse(data); // Display the response data
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div>
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