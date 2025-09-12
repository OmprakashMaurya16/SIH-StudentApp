# API Endpoints Documentation

This document lists all backend API endpoints, their purpose, available options, and possible error codes for integration with the frontend.

---

## Authentication

### POST `/api/auth/register`
- **Description:** Register a new user (student, faculty, or admin).
- **Body:**
  - `fullName`, `email`, `password`, `role`, `rollNo`, `course`, `year`, `department`
- **Success:** 201 Created, user info + token
- **Errors:**
  - 400 User already exists / Invalid data

### POST `/api/auth/login`
- **Description:** Login for any user.
- **Body:**
  - `email`, `password`
- **Success:** 200 OK, user info + token
- **Errors:**
  - 400 Invalid credentials

---

## Student Activities

### POST `/api/activities`
- **Description:** Add a new activity (student only)
- **Body:**
  - `activityType`, `title`, `description`, `date`, `proof`
- **Success:** 201 Created, activity info
- **Errors:**
  - 400 Invalid data
  - 401 Unauthorized

### GET `/api/activities`
- **Description:** Get all activities for logged-in student
- **Success:** 200 OK, list of activities
- **Errors:**
  - 401 Unauthorized

### GET `/api/activities/:id`
- **Description:** Get a specific activity by ID (student only)
- **Success:** 200 OK, activity info
- **Errors:**
  - 403 Not authorized
  - 404 Not found

### PUT `/api/activities/:id`
- **Description:** Update an activity (student only, if not approved)
- **Success:** 200 OK, updated activity
- **Errors:**
  - 403 Not authorized
  - 404 Not found

### DELETE `/api/activities/:id`
- **Description:** Delete an activity (student only, if not approved)
- **Success:** 200 OK, deleted
- **Errors:**
  - 403 Not authorized
  - 404 Not found

---

## Dashboard (Student)

### GET `/api/dashboard/student`
- **Description:** Get student dashboard stats (credits, pending, approved, recent activities)
- **Success:** 200 OK, stats object
- **Errors:**
  - 401 Unauthorized

### GET `/api/dashboard/summary`
- **Description:** Get summary of approved activities
- **Success:** 200 OK, summary object
- **Errors:**
  - 401 Unauthorized

### GET `/api/dashboard/stats`
- **Description:** Get count of approved, pending, rejected activities
- **Success:** 200 OK, stats object
- **Errors:**
  - 401 Unauthorized

---

## Dashboard (Faculty)

### GET `/api/dashboard/faculty`
- **Description:** Get faculty dashboard stats (pending reviews, total students, activities this month)
- **Success:** 200 OK, stats object
- **Errors:**
  - 401 Unauthorized

### GET `/api/dashboard/faculty/students`
- **Description:** List all students in faculty's department
- **Success:** 200 OK, list of students
- **Errors:**
  - 401 Unauthorized

### GET `/api/dashboard/faculty/student/:id`
- **Description:** Get a student's profile and activity stats (faculty's department only)
- **Success:** 200 OK, student profile + stats
- **Errors:**
  - 403 Not authorized
  - 404 Not found

---

## Dashboard (Admin)

### GET `/api/admin/stats`
- **Description:** Get admin dashboard stats (total users, students, faculties, activities)
- **Success:** 200 OK, stats object
- **Errors:**
  - 401 Unauthorized

### GET `/api/admin/reports/dashboard`
- **Description:** Get admin reports dashboard (total activities, active students, credits awarded, pending review)
- **Query:** `from`, `to`, `department`
- **Success:** 200 OK, stats object
- **Errors:**
  - 401 Unauthorized

---

## Activity Validation (Admin/Faculty)

### GET `/api/admin/activities/pending`
- **Description:** List all pending activities for review
- **Success:** 200 OK, list of activities
- **Errors:**
  - 401 Unauthorized

### PUT `/api/admin/activities/:id/approve`
- **Description:** Approve an activity
- **Success:** 200 OK, updated activity
- **Errors:**
  - 404 Not found
  - 400 Not pending

### PUT `/api/admin/activities/:id/reject`
- **Description:** Reject an activity
- **Body:** `validationComment` (optional)
- **Success:** 200 OK, updated activity
- **Errors:**
  - 404 Not found
  - 400 Not pending

---


## Portfolio

### GET `/api/portfolio`
- **Protected:** Student only
- **Description:** Get student's portfolio (user info, all activities with validation info)
- **Success:** 200 OK, user info (no password) and all activities with validation info
- **Errors:**
  - 404 User not found
  - 500 Server error

---

## Reports (Download)

### GET `/api/reports/pdf`
- **Description:** Download activities report as PDF
- **Query:** `from`, `to`, `activityType`, `department`, `studentId`
- **Success:** 200 OK, PDF file
- **Errors:**
  - 401 Unauthorized

### GET `/api/reports/excel`
- **Description:** Download activities report as Excel
- **Query:** `from`, `to`, `activityType`, `department`, `studentId`
- **Success:** 200 OK, Excel file
- **Errors:**
  - 401 Unauthorized

---

## Common Error Codes
- 400: Bad Request (invalid data, not pending, etc.)
- 401: Unauthorized (no/invalid token)
- 403: Forbidden (not allowed)
- 404: Not Found (resource does not exist)
- 500: Internal Server Error (unexpected error)

---

For any endpoint requiring authentication, pass the JWT token as:
```
Authorization: Bearer <token>
```
