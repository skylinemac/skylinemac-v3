import Navbar from "../navbar";

export default function Rules() {
  return (
    <div className="text-gray-900 bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">Competition Format</h2>

        {/** Multiple Choice Round */}
        <div className="mb-8 p-6 bg-white shadow-lg rounded-2xl">
          <h3 className="text-2xl font-semibold mb-4 text-blue-600">Multiple Choice Round</h3>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li><span className="font-medium">30</span> multiple choice questions</li>
            <li><span className="font-medium">40 Minutes</span></li>
            <li>Total Points: <span className="font-medium">90</span></li>
          </ul>
        </div>

        {/** Numerical Response Round */}
        <div className="mb-8 p-6 bg-white shadow-lg rounded-2xl">
          <h3 className="text-2xl font-semibold mb-4 text-blue-600">Numerical Response Round</h3>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li><span className="font-medium">5</span> numerical responses</li>
            <li><span className="font-medium">20 Minutes</span></li>
            <li>Total Points: <span className="font-medium">50</span></li>
          </ul>
        </div>

        {/** Investigative Question Round */}
        <div className="mb-8 p-6 bg-white shadow-lg rounded-2xl">
          <h3 className="text-2xl font-semibold mb-4 text-blue-600">Investigative Question Round</h3>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>Real-life scenario multi-step problem</li>
            <li><span className="font-medium">30 Minutes</span></li>
            <li>Total Points: <span className="font-medium">60</span></li>
          </ul>
        </div>

        {/** College Bowl */}
        <div className="p-6 bg-white shadow-lg rounded-2xl">
          <h3 className="text-2xl font-semibold mb-4 text-blue-600">College Bowl</h3>
          <p className="text-lg">
            Top <span className="font-medium">3</span> scorers from each grade compete in a quiz-style round.
          </p>
        </div>
      </div>
    </div>
  );
}
