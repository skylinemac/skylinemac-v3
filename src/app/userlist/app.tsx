"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentTable from './studtable';
import SearchBar from './searchbar';
import { Student } from './types';
import { format } from 'path';
import { start } from 'repl';

const App: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState<keyof Student>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);

    const apiURL = 'https://87j23b69k9.execute-api.us-west-2.amazonaws.com/dev/entries';

    useEffect(() => {
        fetchStudents();
    }, []);

    function formatJSON(input: string) { 
        input = input.replaceAll("\"", "");
        var startQuote = input.indexOf("{") + 1;
        var endQuote = input.indexOf("=");
        var result = "[{\"" + input.substring(startQuote, endQuote) + "\":";
        while (input.indexOf(",", startQuote) != -1) {
            startQuote = endQuote + 1;
            endQuote = input.indexOf(",", startQuote);
            result += "\"" + input.substring(startQuote, endQuote) + "\",";
            startQuote = endQuote + 2;
            endQuote = input.indexOf("=", startQuote);
            result += "\"" + input.substring(startQuote, endQuote) + "\":";
        }
        startQuote = endQuote + 1;
        endQuote = input.indexOf("}");
        result += "\"" + input.substring(startQuote, endQuote) + "\"}]";
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
                createdAt: item.createdAt,
                name: item.name,
                grade: item.grade,
                school: item.school,
                parentemail: item.parentemail,
                studentemail: item.studentemail,
            }));
            setStudents(students);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };
    

    const handleDelete = async (parentemail: string) => {
        try {
            await axios.post(apiURL, {
                action: 'DELETE',
                parentemail
            });
            fetchStudents();
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    const handleEdit = async (student: Student) => {
        try {
            await axios.post(apiURL, {
                action: 'EDIT',
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
        setStudents(prev => [...prev].sort((a, b) => {
            const compare = a[column] < b[column] ? -1 : a[column] > b[column] ? 1 : 0;
            return order === 'asc' ? compare : -compare;
        }));
    };

    const filteredStudents = students
        ? students.filter(student =>
              Object.values(student).some(value =>
                  value.toString().toLowerCase().includes(searchTerm.toLowerCase())
              )
          )
        : [];

    return (
        <div>
            <h1>Student Database</h1>
            <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
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
    );
};

export default App;
