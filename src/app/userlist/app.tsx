"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentTable from './studtable';
import SearchBar from './searchbar';
import { Student } from './types';

const App: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState<keyof Student>('studentID');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const apiURL = 'https://87j23b69k9.execute-api.us-west-2.amazonaws.com/dev/entries/';

    useEffect(() => {
        fetchStudents();
    }, []);

    
    function formatJSON(input: string) { 
        input = input.replaceAll("\"", "");
        var result = "[";
        var startQuote = input.indexOf("{");
        var endQuote = input.indexOf("}");
        while (input.indexOf("{", startQuote) != -1) {
            result += formatStudent(input.substring(startQuote + 1, endQuote));
            startQuote = endQuote + 3;
            endQuote = input.indexOf("}", startQuote);
            if (startQuote != input.length + 1) {
                result += ",";
            }
        }
        result += "]";
        return result;
    }
    function formatStudent(input: string){
        var startQuote = 0;
        var endQuote = input.indexOf("=");
        var result = "{\"" + input.substring(startQuote, endQuote) + "\":";
        while (input.indexOf(",", startQuote) != -1) {
            startQuote = endQuote + 1;
            endQuote = input.indexOf(",", startQuote);
            result += "\"" + input.substring(startQuote, endQuote) + "\",";
            startQuote = endQuote + 2;
            endQuote = input.indexOf("=", startQuote);
            result += "\"" + input.substring(startQuote, endQuote) + "\":";
        }
        startQuote = endQuote + 1;
        endQuote = input.length;
        result += "\"" + input.substring(startQuote, endQuote) + "\"}";
        return result;
    }

    const fetchStudents = async () => {
        try {
            const response = await axios.get(apiURL);
            console.log('Raw Response from API:', response.data);
    
            // Convert the response data to a JSON-compatible string
            const jsonString = formatJSON(response.data);
            console.log('Transformed JSON String:', jsonString);
    
            // Parse the modified JSON string into an array of objects
            const parsedArray = JSON.parse(jsonString);
    
            // Map and format the data
            const students: Student[] = parsedArray.map((item: any) => ({
                studentID: item.studentID,
                name: item.name,
                grade: item.grade,
                school: item.school,
                parentemail: item.parentemail,
                studentemail: item.studentemail,
            }));
            setLoading(false);
            students.sort((a, b) => a.studentID - b.studentID);
            setStudents(students);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };
    

    const handleDelete = async (studentID: number, name: string) => {
        const data = {
            studentID: studentID,
            name: name,
        }
        try {
            console.log('Deleting student:', studentID, name);
            fetch(apiURL, {
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

    const handleEdit = async (student: Student) => {
        try {
            console.log("editingStudent: " + student.name);
            fetch(apiURL, {
                method: 'PATCH',
                ...student
            });
            setEditingStudent(null);
            fetchStudents();
        } catch (error) {
            console.error('Error editing student:', error);
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
                    onEdit={setEditingStudent}
                    onDelete={handleDelete}
                    editingStudent={editingStudent}
                    setEditingStudent={setEditingStudent}
                    onSaveEdit={handleEdit}
                />
            </div>
            )}
        </div>
    );
};

export default App;
