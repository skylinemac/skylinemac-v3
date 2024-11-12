import React from 'react';
import { Student } from './types';

interface StudentTableProps {
    students: Student[];
    sortColumn: keyof Student;
    sortOrder: 'asc' | 'desc';
    onSort: (column: keyof Student) => void;
    onEdit: (student: Student) => void;
    onDelete: (parentemail: string) => void;
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
    onSaveEdit
}) => {
    return (
        <table>
            <thead>
                <tr>
                    <th onClick={() => onSort('name')}>Name</th>
                    <th onClick={() => onSort('grade')}>Grade</th>
                    <th onClick={() => onSort('school')}>School</th>
                    <th onClick={() => onSort('parentemail')}>Parent Email</th>
                    <th onClick={() => onSort('studentemail')}>Student Email</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {students.map(student => (
                    <tr key={student.parentemail}>
                        {editingStudent?.parentemail === student.parentemail ? (
                            <>
                                <td><input value={editingStudent.name} onChange={e => setEditingStudent({...editingStudent, name: e.target.value})} /></td>
                                <td><input value={editingStudent.grade} type="number" onChange={e => setEditingStudent({...editingStudent, grade: parseInt(e.target.value)})} /></td>
                                <td><input value={editingStudent.school} onChange={e => setEditingStudent({...editingStudent, school: e.target.value})} /></td>
                                <td>{student.parentemail}</td>
                                <td><input value={editingStudent.studentemail} onChange={e => setEditingStudent({...editingStudent, studentemail: e.target.value})} /></td>
                                <td>
                                    <button onClick={() => onSaveEdit(editingStudent)}>Save</button>
                                    <button onClick={() => setEditingStudent(null)}>Cancel</button>
                                </td>
                            </>
                        ) : (
                            <>
                                <td>{student.name}</td>
                                <td>{student.grade}</td>
                                <td>{student.school}</td>
                                <td>{student.parentemail}</td>
                                <td>{student.studentemail}</td>
                                <td>
                                    <button onClick={() => setEditingStudent(student)}>Edit</button>
                                    <button onClick={() => onDelete(student.parentemail)}>Delete</button>
                                </td>
                            </>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default StudentTable;
