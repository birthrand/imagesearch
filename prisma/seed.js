/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function resetDatabase() {
  await prisma.notification.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.discussionPost.deleteMany();
  await prisma.discussionThread.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.quizOption.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.contentBlock.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.courseModule.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.course.deleteMany();
  await prisma.role.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  await resetDatabase();

  const adminRole = await prisma.role.create({
    data: {
      name: 'ADMIN',
      description: 'Platform administrators with global permissions.'
    }
  });

  const instructorRole = await prisma.role.create({
    data: {
      name: 'INSTRUCTOR',
      description: 'Course authors and instructors.'
    }
  });

  const studentRole = await prisma.role.create({
    data: {
      name: 'STUDENT',
      description: 'Learners enrolled in courses.'
    }
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      passwordHash: 'hashed-password',
      profile: {
        create: {
          firstName: 'Ada',
          lastName: 'Admin',
          bio: 'Keeps the platform running smoothly.'
        }
      },
      roles: {
        create: [{ role: { connect: { id: adminRole.id } } }]
      }
    },
    include: {
      profile: true,
      roles: { include: { role: true } }
    }
  });

  const instructor = await prisma.user.create({
    data: {
      email: 'instructor@example.com',
      passwordHash: 'hashed-password',
      profile: {
        create: {
          firstName: 'Iris',
          lastName: 'Instructor',
          bio: 'Passionate about empowering teams with modern tooling.'
        }
      },
      roles: {
        create: [{ role: { connect: { id: instructorRole.id } } }]
      }
    }
  });

  const student = await prisma.user.create({
    data: {
      email: 'learner@example.com',
      passwordHash: 'hashed-password',
      profile: {
        create: {
          firstName: 'Liam',
          lastName: 'Learner',
          bio: 'Exploring modern product development practices.'
        }
      },
      roles: {
        create: [{ role: { connect: { id: studentRole.id } } }]
      }
    }
  });

  const course = await prisma.course.create({
    data: {
      slug: 'nextjs-learning-platform',
      title: 'Next.js Learning Platform',
      description:
        'Build a full learning experience with Next.js, Prisma, PostgreSQL, and modern domain patterns.'
    }
  });

  const orientationModule = await prisma.courseModule.create({
    data: {
      courseId: course.id,
      slug: 'orientation',
      title: 'Orientation',
      summary: 'Kick off the course and align on expectations.',
      position: 1
    }
  });

  const dataLayerModule = await prisma.courseModule.create({
    data: {
      courseId: course.id,
      slug: 'data-layer',
      title: 'Data Layer',
      summary: 'Model domain entities and learn about Prisma best practices.',
      position: 2
    }
  });

  const kickOffLesson = await prisma.lesson.create({
    data: {
      moduleId: orientationModule.id,
      slug: 'kick-off',
      title: 'Course Kick-off',
      summary: 'Understand the learning goals and how to navigate the platform.',
      position: 1
    }
  });

  await prisma.contentBlock.create({
    data: {
      lessonId: kickOffLesson.id,
      type: 'markdown',
      position: 1,
      content: {
        heading: 'Welcome!',
        body: 'We are excited to have you on board. This platform demonstrates a modular learning experience built with Next.js.'
      }
    }
  });

  await prisma.contentBlock.create({
    data: {
      lessonId: kickOffLesson.id,
      type: 'callout',
      position: 2,
      content: {
        tone: 'info',
        message: 'Make sure you have Docker running so you can spin up the PostgreSQL database quickly.'
      }
    }
  });

  const dueAt = new Date();
  dueAt.setDate(dueAt.getDate() + 7);

  const introductionAssignment = await prisma.assignment.create({
    data: {
      lessonId: kickOffLesson.id,
      courseId: course.id,
      title: 'Introduce Yourself',
      description: 'Share your background and what you hope to build in the course discussion thread.',
      dueAt,
      creator: { connect: { id: instructor.id } }
    }
  });

  await prisma.quiz.create({
    data: {
      lessonId: kickOffLesson.id,
      courseId: course.id,
      title: 'Orientation Checkpoint',
      description: 'Confirm your understanding of the course structure.',
      timeLimit: 10,
      questions: {
        create: [
          {
            prompt: 'Which technologies back the persistent data layer for this project?',
            position: 1,
            options: {
              create: [
                { text: 'Prisma and PostgreSQL', isCorrect: true },
                { text: 'MongoDB and Express', isCorrect: false },
                { text: 'SQLite only', isCorrect: false }
              ]
            }
          },
          {
            prompt: 'Where can you find schema relationship documentation?',
            position: 2,
            options: {
              create: [
                { text: 'In the docs/schema.md file', isCorrect: true },
                { text: 'Only in the README', isCorrect: false },
                { text: 'It is emailed to you separately', isCorrect: false }
              ]
            }
          }
        ]
      }
    }
  });

  const prismaLesson = await prisma.lesson.create({
    data: {
      moduleId: dataLayerModule.id,
      slug: 'prisma-domain-model',
      title: 'Designing the Domain Schema',
      summary: 'Model roles, courses, and all supporting learning entities with Prisma.',
      position: 1
    }
  });

  await prisma.contentBlock.create({
    data: {
      lessonId: prismaLesson.id,
      type: 'markdown',
      position: 1,
      content: {
        heading: 'Domain Overview',
        body: 'Users, profiles, courses, assignments, and assessments all come together to create a cohesive learning journey.'
      }
    }
  });

  await prisma.contentBlock.create({
    data: {
      lessonId: prismaLesson.id,
      type: 'code',
      position: 2,
      content: {
        language: 'prisma',
        snippet: 'model User { id String @id @default(cuid()) email String @unique }'
      }
    }
  });

  await prisma.assignment.create({
    data: {
      lessonId: prismaLesson.id,
      courseId: course.id,
      title: 'Model the Assignment Workflow',
      description:
        'Extend the Prisma schema to support peer reviews and automated grading, then share your approach.',
      dueAt: new Date(dueAt.getTime() + 3 * 24 * 60 * 60 * 1000),
      creator: { connect: { id: instructor.id } }
    }
  });

  const instructorEnrollment = await prisma.enrollment.create({
    data: {
      userId: instructor.id,
      courseId: course.id,
      status: 'ACTIVE'
    }
  });

  const studentEnrollment = await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course.id,
      status: 'ACTIVE'
    }
  });

  const submission = await prisma.submission.create({
    data: {
      assignmentId: introductionAssignment.id,
      studentId: student.id,
      content: {
        goals: 'Ship a polished learning experience demo in four weeks.',
        interest: 'Understanding how Prisma maps domain concepts to SQL tables.'
      }
    }
  });

  await prisma.grade.create({
    data: {
      enrollmentId: studentEnrollment.id,
      assignmentId: introductionAssignment.id,
      submissionId: submission.id,
      score: 95,
      maxScore: 100,
      gradedBy: { connect: { id: instructor.id } }
    }
  });

  const discussionThread = await prisma.discussionThread.create({
    data: {
      courseId: course.id,
      authorId: instructor.id,
      title: 'Week 1 Kick-off'
    }
  });

  const instructorPost = await prisma.discussionPost.create({
    data: {
      threadId: discussionThread.id,
      authorId: instructor.id,
      body: 'Share a bit about your background and what excites you about the data layer!'
    }
  });

  await prisma.discussionPost.create({
    data: {
      threadId: discussionThread.id,
      authorId: student.id,
      parentId: instructorPost.id,
      body: 'Thrilled to learn how Prisma accelerates backend workflows.'
    }
  });

  const announcement = await prisma.announcement.create({
    data: {
      courseId: course.id,
      authorId: instructor.id,
      title: 'Live Q&A Session',
      message: 'Join us this Friday for a live Q&A on the architecture choices behind the platform.'
    }
  });

  await prisma.notification.create({
    data: {
      userId: student.id,
      announcementId: announcement.id,
      type: 'ANNOUNCEMENT',
      message: 'New announcement: Live Q&A Session',
      metadata: {
        courseSlug: course.slug
      }
    }
  });

  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: 'USER_CREATED',
      entity: 'User',
      entityId: instructor.id,
      metadata: {
        actorEmail: admin.email
      }
    }
  });

  await prisma.auditLog.create({
    data: {
      userId: instructor.id,
      action: 'COURSE_PUBLISHED',
      entity: 'Course',
      entityId: course.id,
      metadata: {
        slug: course.slug
      }
    }
  });

  console.info('Database seeded with sample roles, users, course content, and interactions.');
}

main()
  .catch((error) => {
    console.error('Failed to seed database', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
