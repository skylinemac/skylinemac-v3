"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import Navbar from "@/app/navbar";

interface Question {
  difficulty: string;
  question: string;
  answer: string;
  source: string;
  questionNumber: string;
}

const QuizApp: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    axios.get<Question[]>("https://r1vzmzxn2i.execute-api.us-west-2.amazonaws.com/dev/quizzes")
      .then((response) => {
        setQuestions(response.data);
        selectRandomQuestion(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const selectRandomQuestion = (data: Question[]) => {
    if (data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.length);
      setCurrentQuestion(data[randomIndex]);
      setFeedback("");
      setUserAnswer("");
    }
  };

  const handleSubmit = () => {
    if (!currentQuestion) return;
    if (userAnswer.trim() === currentQuestion.answer) {
      setFeedback("✅ Correct!");
    } else {
      setFeedback("❌ Incorrect. Try again!");
    }
  };

  const renderMathText = (text: string) => {
    return text.split(/\$/).map((part, index) =>
      index % 2 === 1 ? <InlineMath key={index} math={part} /> : part
    );
  };

  return (
    <div>
      <Navbar/>
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg text-black">
      <h1 className="text-2xl font-bold mb-4">SMAC Practice Quiz</h1>
      {currentQuestion && (
        <div>
          <p className="text-lg"><strong>Question:</strong> {renderMathText(currentQuestion.question)}</p>
          <p className="text-sm text-gray-600"><strong>Difficulty:</strong> {currentQuestion.difficulty}</p>
          <p className="text-sm text-gray-600"><strong>Source:</strong> {currentQuestion.source}</p>
          <input
            type="text"
            className="border p-4 w-full mt-4 bg-white"
            placeholder="Enter your answer"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
          />
          <button
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={handleSubmit}
          >
            Submit
          </button>
          {feedback && <p className="mt-2 font-semibold">{feedback}</p>}
        </div>
      )}
      <button
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md"
        onClick={() => selectRandomQuestion(questions)}
      >
        New Question
      </button>
    </div>
    </div>
  );
};

export default QuizApp;
