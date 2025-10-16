# Domain Schema Overview

This document summarizes the Prisma models that power the learning platform domain and how they relate to one another.

> For the full implementation details refer to [`prisma/schema.prisma`](../prisma/schema.prisma).

## Core Identity

- **User** – Primary actor in the system. Users own a single `Profile`, can hold many `Role`s (through the `UserRole` join table), enrol in courses, submit assignments, post in discussions, author announcements, and receive notifications.
- **Profile** – One-to-one extension of `User` that stores human-friendly information such as name, biography, and avatar.
- **Role** / **UserRole** – Roles (Admin, Instructor, Student, etc.) are managed independently and linked to users via `UserRole`. This allows flexible many-to-many role assignment while tracking when a role was granted.

## Course Structure

- **Course** – High level learning path identified by a unique slug. Courses own many `CourseModule`s, `Enrollment`s, `Assignment`s, `Quiz` records, plus discussion threads and announcements.
- **CourseModule** – Groups related lessons inside a course with ordering metadata. Deleting a course cascades to its modules and lessons.
- **Lesson** – The atomic teaching unit. Lessons contain ordered `ContentBlock`s, zero or more `Assignment`s, and an optional set of `Quiz` assessments.
- **ContentBlock** – Flexible JSON-backed content segments that allow paragraphs, call-outs, video embeds, etc., while retaining ordering per lesson.

## Enrollment & Progress

- **Enrollment** – Connects a `User` and a `Course` with a status (active, completed, dropped). Downstream records such as `Grade`s link back to a specific enrollment to capture context.
- **Assignment** – Task authored by an instructor for a lesson. Stores metadata including due dates and the authoring instructor (`createdById`).
- **Submission** – Student responses to an assignment. A composite unique constraint on `(assignmentId, studentId)` ensures one submission per learner per assignment.
- **Grade** – Records scores for assignments or quizzes. Grades tie back to the learner through `enrollmentId` and optionally reference the evaluator (`gradedById`).

## Assessments

- **Quiz** – Lesson-specific assessments with optional time limits. Quizzes can be reused at the course level via the optional `courseId` field.
- **QuizQuestion** – Ordered questions for a quiz and their metadata (prompt, explanation, type).
- **QuizOption** – Possible answers for a question with an `isCorrect` flag for grading logic.

## Collaboration & Communication

- **DiscussionThread** – Course-scoped conversation threads. Tracks the author and status (open/closed) while cascading posts on deletion.
- **DiscussionPost** – Individual messages in a thread with self-referencing replies for threaded conversations.
- **Announcement** – Instructor-authored broadcast messages per course. Trigger related `Notification` records when published.
- **Notification** – Delivery mechanism for alerts to users. Supports typed notifications (`ANNOUNCEMENT`, `REMINDER`, etc.) with optional JSON metadata.
- **AuditLog** – Immutable feed of important actions (user creation, course publication, etc.) with optional actor linkage. Useful for observability and compliance.

## Relationship Highlights

```text
User --(1:1)--> Profile
User --(M:N)--> Role (via UserRole)
User --(M:N)--> Course (via Enrollment)
Course --(1:N)--> CourseModule --(1:N)--> Lesson --(1:N)--> ContentBlock
Lesson --(1:N)--> Assignment --(1:N)--> Submission --(1:1)--> Grade
Lesson --(1:N)--> Quiz --(1:N)--> QuizQuestion --(1:N)--> QuizOption
Course --(1:N)--> DiscussionThread --(1:N)--> DiscussionPost
Course --(1:N)--> Announcement --(1:N)--> Notification
User --(1:N)--> AuditLog
```

This structure supports typical LMS workflows—role management, enrollment tracking, lesson planning, assessments, collaboration, and system notifications—while keeping the schema cohesive and extensible.
