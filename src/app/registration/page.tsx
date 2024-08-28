"use client";

import { useState, ChangeEvent, FormEvent } from 'react';

interface ResponseType {
  name: string;
  email: string;
  message: string;
}

export default function DisplayForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [response, setResponse] = useState<ResponseType | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch('https://vvq9yn8c3m.execute-api.us-west-2.amazonaws.com/dev/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      console.log('Response Received');
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
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        <textarea name="message" placeholder="Message" value={formData.message} onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
      {response && (
        <div>
          <h3>Submitted Data:</h3>
          <p>Name: {response.name}</p>
          <p>Email: {response.email}</p>
          <p>Message: {response.message}</p>
        </div>
      )}
    </div>
  );
}