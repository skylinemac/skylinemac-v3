"use client";

import React, { useState } from 'react';
import NavBar from "../navbar";
import axios from 'axios';
import App from './app';

export default function UserList() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [authenticated, setAuthentication] = useState(false);

    // Handler for form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if username and password are filled out
        if (!username || !password) {
            setErrorMessage('Please fill out both fields.');
            return;
        }

        try {
            const response = await axios.get('https://87j23b69k9.execute-api.us-west-2.amazonaws.com/dev/auth');
            const data = response.data;
            if (data.Username === username && data.Password === password) {
                setAuthentication(true);
            }

        } catch (error) {
            setErrorMessage('Failed to fetch user details. Please try again.');
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            {authenticated ? (
                <App />
            ) : (
                 <div className="flex justify-center items-center flex-grow">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-2xl text-black font-semibold mb-4">Host Login</h2>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-medium font-medium text-gray-700">Username:</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full p-3 border rounded-lg bg-white text-black focus:outline-none focus:ring focus:ring-blue-300"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-medium font-medium text-gray-700">Password:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full p-3 border rounded-lg bg-white text-black focus:outline-none focus:ring focus:ring-blue-300"
                           />
                        </div>

                        <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Submit</button>

                        {errorMessage && (
                            <p className="mt-4 text-red-600 text-sm">{errorMessage}</p>
                        )}
                    </form>
                </div>
            )}
        </div>
    );
};
