"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import NavBar from "@/app/navbar";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

interface QuestionType {
  questionID: number;
  question: string;
  answer: string;
  source: string;
  difficulty: string;
  constant: number;
}

export default function QuestionSubmissionForm() {
  const [formData, setFormData] = useState<QuestionType>({
    questionID: 0,
    question: '',
    answer: '',
    source: '',
    difficulty: '',
    constant: 1,
  });
  const [response, setResponse] = useState<QuestionType | null>(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Auto-resize textarea for question and answer
    if (name === 'question' || name === 'answer') {
      const textarea = e.target as HTMLTextAreaElement;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    // Validation: Check if required fields are filled
    setIsValid(
      formData.question.trim() !== '' &&
      formData.answer.trim() !== '' &&
      formData.source.trim() !== '' &&
      formData.difficulty.trim() !== ''
    );
  }, [formData]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('https://r34z6bpw7i.execute-api.us-west-2.amazonaws.com/dev/highestID', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      let recentQuestion = await response.json();
      const newID = recentQuestion.questionID + 1;
      
      setFormData(prevFormData => {
        return { ...prevFormData, questionID: newID };
      });

      setIsFormSubmitted(true);
    } catch (error) {
      console.error('Error getting latest question:', error);
    }
  };

  useEffect(() => {
    if (isFormSubmitted) {
      const submitForm = async () => {
        try {
          const res = await fetch('https://r34z6bpw7i.execute-api.us-west-2.amazonaws.com/dev/newQuestion', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
          const data: QuestionType = await res.json();
          setResponse(data);
        } catch (error) {
          console.error('Error submitting form:', error);
        }
      };

      submitForm();
      setIsFormSubmitted(false);
    }
  }, [isFormSubmitted, formData]);

  const renderMathText = (text: string) => {
    return text.split(/\$/).map((part, index) =>
      index % 2 === 1 ? <InlineMath key={index} math={part} /> : part
    );
  };

  return (
    <div>
      <NavBar />
      <div className="max-w-2xl mx-auto bg-gray-200 shadow-md rounded-lg p-6 mt-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Question Submission Form</h2>
        <p className="text-black text-left">Hello Question Contributor!</p>
        <br/>
        <p className="text-black text-left">
          Thank you for helping us expand our question bank. Please fill out the form below with care and precision.
        </p>
        <br/>
        <p className="text-black text-left">Note: All fields must be filled out to submit the question</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <br/>
          <p className="text-black text-left font-semibold">Question*</p>
          <textarea
            name="question"
            placeholder="Enter the full question text"
            value={formData.question}
            onChange={handleChange}
            rows={3}
            className="w-full p-3 border rounded-lg bg-white text-black focus:outline-none focus:ring focus:ring-blue-300 resize-none overflow-hidden"
          />
          <br/>
          <br/>
          <p className="text-black text-left font-semibold">Answer*</p>
          <textarea
            name="answer"
            placeholder="Enter the complete answer"
            value={formData.answer}
            onChange={handleChange}
            rows={3}
            className="w-full p-3 border rounded-lg bg-white text-black focus:outline-none focus:ring focus:ring-blue-300 resize-none overflow-hidden"
          />
          <br/>
          <br/>
          <p className="text-black text-left font-semibold">Source*</p>
          <input
            name="source"
            placeholder="Where did this question originate? (e.g., textbook, competition)"
            value={formData.source}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg bg-white text-black focus:outline-none focus:ring focus:ring-blue-300"
          />
          <br/>
          <br/>
          <p className="text-black text-left font-semibold">Difficulty*</p>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg bg-white text-black focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="">Select Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
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
          <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-md text-black">
            <h3 className="text-xl font-medium text-gray-700">Submitted Question:</h3>
            <p><strong>Question:</strong> {renderMathText(response.question)}</p>
            <p><strong>Answer:</strong> {response.answer}</p>
            <p><strong>Source:</strong> {response.source}</p>
            <p><strong>Difficulty:</strong> {response.difficulty}</p>
          </div>
        )}
      </div>
    </div>
  );
}