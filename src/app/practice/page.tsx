import React, { useEffect, useState } from "react";
import axios from "axios";

interface Quiz {
  quizId: string;
  title: string;
}

const Home: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    axios.get("https://r1vzmzxn2i.execute-api.us-west-2.amazonaws.com/dev/quizzes")
      .then(response => setQuizzes(response.data))
      .catch(error => console.error("Error fetching quizzes", error));
  }, []);

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">Select a Quiz</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizzes.map(quiz => (
          <a key={quiz.quizId} href={`/quiz/${quiz.quizId}`} className="bg-blue-500 text-white p-4 rounded-lg shadow-lg hover:bg-blue-600">
            {quiz.title}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Home;
