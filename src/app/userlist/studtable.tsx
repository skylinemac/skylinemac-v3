import React from 'react';
import { Student } from './types';

interface StudentTableProps {
    students: Student[];
    sortColumn: keyof Student;
    sortOrder: 'asc' | 'desc';
    onSort: (column: keyof Student) => void;
    onEdit: (student: Student) => void;
    onDelete: (studentID: number) => void;
    editingStudent: Student | null;
    setEditingStudent: (student: Student | null) => void;
    onSaveEdit: (student: Student) => void;
}

const StudentTable: React.FC<StudentTableProps> = ({
    students,
    sortColumn,
    sortOrder,
    onSort,
    onEdit,
    onDelete,
    editingStudent,
    setEditingStudent,
    onSaveEdit,
}) => {
    const getArrow = (column: keyof Student) => {
        if (!sortColumn) {
            return '';
        }
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
                        <th
                            className="p-4 cursor-pointer"
                            onClick={() => onSort('studentID')}
                        >
                            Student ID {getArrow('studentID')}
                        </th>
                        <th
                            className="p-4 cursor-pointer"
                            onClick={() => onSort('name')}
                        >
                            Name {getArrow('name')}
                        </th>
                        <th
                            className="p-4 cursor-pointer"
                            onClick={() => onSort('grade')}
                        >
                            Grade {getArrow('grade')}
                        </th>
                        <th
                            className="p-4 cursor-pointer"
                            onClick={() => onSort('school')}
                        >
                            School {getArrow('school')}
                        </th>
                        <th
                            className="p-4 cursor-pointer"
                            onClick={() => onSort('parentemail')}
                        >
                            Parent Email {getArrow('parentemail')}
                        </th>
                        <th
                            className="p-4 cursor-pointer"
                            onClick={() => onSort('studentemail')}
                        >
                            Student Email {getArrow('studentemail')}
                        </th>
                        <th className="p-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.studentID} className="hover:bg-gray-50">
                            {editingStudent?.studentID === student.studentID ? (
                                <>
                                    <td className="p-4">{student.studentID}</td>
                                    <td>
                                        <input
                                            className="w-full p-2 border rounded bg-white text-black"
                                            value={editingStudent.name}
                                            onChange={(e) =>
                                                setEditingStudent({
                                                    ...editingStudent,
                                                    name: e.target.value,
                                                })
                                            }
                                        />
                                    </td>
                                    <td>
                                        <input
                                            className="w-full p-2 border rounded bg-white text-black"
                                            value={editingStudent.grade}
                                            type="number"
                                            onChange={(e) =>
                                                setEditingStudent({
                                                    ...editingStudent,
                                                    grade: parseInt(e.target.value),
                                                })
                                            }
                                        />
                                    </td>
                                    <td>
                                        <input
                                            className="w-full p-2 border rounded bg-white text-black"
                                            value={editingStudent.school}
                                            onChange={(e) =>
                                                setEditingStudent({
                                                    ...editingStudent,
                                                    school: e.target.value,
                                                })
                                            }
                                        />
                                    </td>
                                    <td className="p-4">{student.parentemail}</td>
                                    <td>
                                        <input
                                            className="w-full p-2 border rounded bg-white text-black"
                                            value={editingStudent.studentemail}
                                            onChange={(e) =>
                                                setEditingStudent({
                                                    ...editingStudent,
                                                    studentemail: e.target.value,
                                                })
                                            }
                                        />
                                    </td>
                                    <td className="p-4">
                                        <button
                                            className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                                            onClick={() => onSaveEdit(editingStudent)}
                                        >
                                            Save
                                        </button>
                                        <button
                                            className="ml-2 px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                                            onClick={() => setEditingStudent(null)}
                                        >
                                            Cancel
                                        </button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td className="p-4">{student.studentID}</td>
                                    <td className="p-4">{student.name}</td>
                                    <td className="p-4">{student.grade}</td>
                                    <td className="p-4">{student.school}</td>
                                    <td className="p-4">{student.parentemail}</td>
                                    <td className="p-4">{student.studentemail}</td>
                                    <td className="p-4">
                                        <button
                                            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                                            onClick={() => setEditingStudent(student)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="ml-2 px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                                            onClick={() => onDelete(student.studentID)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StudentTable;
