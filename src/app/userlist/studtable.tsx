import React from 'react';
import { Student } from './types';

interface StudentTableProps {
    students: Student[];
    sortColumn: keyof Student;
    sortOrder: 'asc' | 'desc';
    onSort: (column: keyof Student) => void;
    onDelete: (studentID: number, name: string) => void;
}

const StudentTable: React.FC<StudentTableProps> = ({
    students,
    sortColumn,
    sortOrder,
    onSort,
    onDelete,
}) => {
    const getArrow = (column: keyof Student) => {
        if (column === sortColumn) {
            return sortOrder === 'desc' ? '▲' : '▼';
        }
        return '';
    };

    return (
        <div className="justify-center items-center min-h-screen bg-gray-100">
            <table className="w-full max-w-5xl mx-auto bg-white border border-gray-200 rounded-lg shadow-lg text-black">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-4 cursor-pointer" onClick={() => onSort('studentID')}>
                            Student ID {getArrow('studentID')}
                        </th>
                        <th className="p-4 cursor-pointer" onClick={() => onSort('name')}>
                            Name {getArrow('name')}
                        </th>
                        <th className="p-4 cursor-pointer" onClick={() => onSort('grade')}>
                            Grade {getArrow('grade')}
                        </th>
                        <th className="p-4 cursor-pointer" onClick={() => onSort('school')}>
                            School {getArrow('school')}
                        </th>
                        <th className="p-4 cursor-pointer" onClick={() => onSort('parentemail')}>
                            Parent Email {getArrow('parentemail')}
                        </th>
                        <th className="p-4 cursor-pointer" onClick={() => onSort('studentemail')}>
                            Student Email {getArrow('studentemail')}
                        </th>
                        <th className="p-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.studentID} className="hover:bg-gray-50">
                            <td className="p-4">{student.studentID}</td>
                            <td className="p-4">{student.name}</td>
                            <td className="p-4">{student.grade}</td>
                            <td className="p-4">{student.school}</td>
                            <td className="p-4">{student.parentemail}</td>
                            <td className="p-4">{student.studentemail}</td>
                            <td className="p-4">
                                <button
                                    className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                                    onClick={() => onDelete(student.studentID, student.name)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StudentTable;
