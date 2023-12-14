# ALIS - STI

## Overview

The Library System is a React-based library management system designed to simplify and streamline the management of books and library transactions. It provides a user-friendly interface for librarians, students and teachers to efficiently handle various tasks associated with running a library.

[![login cover](/public/assets/20230521_235452.jpg)](https://alis-sti.com/)

## Roles

1. Admin
2. Student
3. Teacher

## Features

**Admin**

- **Dashboard**: Monitor the number of borrowed books, overdue, returned and top borrower.
- **Inventory**: Add, update, and remove books from the library inventory.
- **User Management**: Add and update update users
- **Transactions**: Module for admin to be able to return the book
- **Archives**: Module for lost and damaged books
- **Transaction History**: Monitor and manage book check-ins, check-outs, and overdue fines.
- **Search and Filter**: Easily search and filter books and patrons based on various criteria.
- **User Authentication**: Secure login system for administrators and librarians.

**Student/Teacher**

- **Circulation**: Ability to list all the borrowed books of students
- **Cataloging**: Ability to list all the books regardless of its status

## Installation

1. Navigate to the project directory: `cd alis-sti`
2. Install dependencies: `npm install` (make sure you are using >= v18 of node)
3. Run the application: `npm run dev`

## Usage

1. Access the application through your web browser at: `http://localhost:5173/`
2. Login in with your admin/student/teacher credentials
3. Start making some transactions
