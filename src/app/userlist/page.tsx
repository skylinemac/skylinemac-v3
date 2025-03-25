"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentTable from './studtable';
import SearchBar from './searchbar';
import { Student } from './types';
import NavBar from '../navbar';

const App: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState<keyof Student>('studentID');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [loading, setLoading] = useState<boolean>(true);

    const apiURL = 'https://87j23b69k9.execute-api.us-west-2.amazonaws.com/dev/entries/';

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get(apiURL);
            console.log('Raw Response from API:', response.data);
    
            // Ensure response data is properly formatted JSON
            if (typeof response.data === 'string') {
                try {
                    const parsedData = JSON.parse(response.data);
                    setStudents(formatStudents(parsedData));
                } catch (error) {
                    console.error('Error parsing JSON response:', error);
                    setStudents([]);
                }
            } else {
                setStudents(formatStudents(response.data));
            }
    
            setLoading(false);
        } catch (error) {
            console.error('Error fetching students:', error);
            setLoading(false);
        }
    };
    
    // Helper function to format student data
    const formatStudents = (data: any[]): Student[] => {
        return data.map((item) => ({
            studentID: Number(item.studentID),
            name: item.name || '',
            grade: Number(item.grade),
            school: item.school || '',
            parentemail: item.parentemail || '',
            studentemail: item.studentemail || '',
        })).sort((a, b) => a.studentID - b.studentID);
    };
    
    

    const handleDelete = async (studentID: number, name: string) => {
        const data = {
            studentID: studentID,
            name: name,
        }
        try {
            console.log('Deleting student:', studentID, name);
            await fetch(apiURL, {
                method: 'DELETE',
                headers: {
                     "content-type": "application/json",
                },
                body: JSON.stringify(data),
            }, 
        );
            fetchStudents();
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };


    const handleSort = (column: keyof Student) => {
        const order = column === sortColumn && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortOrder(order);
        setStudents(prev =>
            [...prev].sort((a, b) => {
                if (column === 'studentID' || column === 'grade') {
                    // Numeric comparison
                    const compare = (a[column] as number) - (b[column] as number);
                    return order === 'asc' ? compare : -compare;
                } else {
                    // String comparison
                    const compare = (a[column] as string).localeCompare(b[column] as string);
                    return order === 'asc' ? compare : -compare;
                }
            })
        );
    };
    

    const filteredStudents = students
        ? students.filter(student =>
              Object.values(student).some(value =>
                  value != null && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
              )
          )
        : [];

    return (
        <div>
            <NavBar/>
            <div className="flex flex-col items-center justify-center min-h-screen p-4">

            <h1 className="text-2xl font-bold mb-4 text-black">Student Database</h1>
            <div className="w-full max-w-md mb-4">
                <SearchBar 
                    searchTerm={searchTerm} 
                    onSearch={setSearchTerm} 
                />
            </div>
            {loading ? (
                <div className="items-center justify-center min-h-screen mt-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                </div>
            ) : (
            <div className= "mt-4">
                <StudentTable
                    students={filteredStudents}
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                    onDelete={handleDelete}
                />
            </div>
            )}
        </div>
        </div>
    );
};

export default App;
