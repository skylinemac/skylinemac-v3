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
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    // Validation: Check if all fields are filled
    setIsValid(
      formData.name.trim() !== '' &&
      formData.grade.toString().trim() !== '' &&
      formData.school.trim() !== '' &&
      formData.parentemail.trim() !== '' &&
      formData.studentemail.trim() !== ''
    );
  }, [formData]);

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
      const newID = recentStudent.data.studentID + 1;

      setFormData(prevFormData => {
        return { ...prevFormData, studentID: newID };
      });

      setIsFormSubmitted(true);
    } catch (error) {
      console.error('Error getting latest student:', error);
    }
  };

  useEffect(() => {
    if (isFormSubmitted) {
      const submitForm = async () => {
        try {
          const res = await fetch('https://vvq9yn8c3m.execute-api.us-west-2.amazonaws.com/dev/registration', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
          const data: ResponseType = await res.json();
          setResponse(data);
        } catch (error) {
          console.error('Error submitting form:', error);
        }
      };

      submitForm();
      setIsFormSubmitted(false);
    }
  }, [isFormSubmitted, formData]);

  return (
    <div>
      <NavBar />
      <div className="max-w-2xl mx-auto bg-gray-200 shadow-md rounded-lg p-6 mt-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Student Registration Form</h2>
        <p className="text-black text-left"> Hello Prospective SMAC Participant/Parent! </p>
        <br/>
        <p className="text-black text-left">Thank you for your interest in the Skyline Math Applications Contest!
           Our team has been hard at work preparing for the 2025 competition, with a brand-new set of problems, 
           opportunities, and rewards for all of our participants.
           We are excited to have you join us for this year's competition: all you need to do is fill out the form below and we'll handle the rest!
        </p>
        <br/>
        <p className="text-black text-left">Note: All fields must be filled out to submit the registration</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <br/>
          <p className="text-black text-left font-semibold">Student's Full Name (First, Last)*</p>
          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg bg-white text-black focus:outline-none focus:ring focus:ring-blue-300"
          />
          <br/>
          <br/>
          <p className="text-black text-left font-semibold">Student's Grade Level*</p>
          <input
            name="grade"
            placeholder="Grade"
            value={formData.grade}
            onChange={handleChange}
            type="number"
            className="w-full p-3 border rounded-lg bg-white text-black focus:outline-none focus:ring focus:ring-blue-300"
          />
          <br/>
          <br/>
          <p className="text-black text-left font-semibold">Student's School*</p>
          <input
            name="school"
            placeholder="School"
            value={formData.school}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg bg-white text-black focus:outline-none focus:ring focus:ring-blue-300"
          />
          <br/>
          <br/>
          <p className="text-black text-left font-semibold">Parent's Email*</p>
          <input
            name="parentemail"
            placeholder="Parent Email"
            value={formData.parentemail}
            onChange={handleChange}
            type="email"
            className="w-full p-3 border rounded-lg bg-white text-black focus:outline-none focus:ring focus:ring-blue-300"
          />
          <br/>
          <br/>
          <p className="text-black text-left font-semibold">Student's Email (Optional - enter N/A if undisclosed)</p>
          <input
            name="studentemail"
            placeholder="Student Email"
            value={formData.studentemail}
            onChange={handleChange}
            type="email"
            className="w-full p-3 border rounded-lg bg-white text-black focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-3 text-white font-semibold rounded-lg 
              ${isValid ? 'bg-blue-500 hover:bg-blue-600 focus:ring focus:ring-blue-300' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            Submit
          </button>
        </form>
        {response && (
          <div className="mt-6 bg-gray-50 p-4 text-black rounded-lg shadow-md">
            <h3 className="text-xl font-medium text-gray-700">Thank you for registering for our competition! Please verify that a confirmation email was received!</h3>
          </div>
        )}
      </div>
    </div>
  );
}
