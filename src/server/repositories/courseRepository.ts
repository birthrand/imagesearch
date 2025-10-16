import type { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

const courseInclude = {
  modules: {
    orderBy: { position: 'asc' },
    include: {
      lessons: {
        orderBy: { position: 'asc' },
        include: {
          contentBlocks: {
            orderBy: { position: 'asc' }
          },
          assignments: {
            orderBy: { createdAt: 'asc' },
            include: {
              submissions: true,
              grades: true
            }
          },
          quizzes: {
            orderBy: { createdAt: 'asc' },
            include: {
              questions: {
                orderBy: { position: 'asc' },
                include: {
                  options: {
                    orderBy: { text: 'asc' }
                  }
                }
              },
              grades: true
            }
          }
        }
      }
    }
  },
  enrollments: {
    include: {
      user: {
        include: {
          profile: true,
          roles: {
            include: {
              role: true
            }
          }
        }
      }
    }
  },
  announcements: {
    orderBy: { publishedAt: 'desc' }
  }
} satisfies Prisma.CourseInclude;

export type CourseWithRelations = Prisma.CourseGetPayload<{ include: typeof courseInclude }>;

export async function listCoursesWithModules(): Promise<CourseWithRelations[]> {
  return prisma.course.findMany({
    include: courseInclude,
    orderBy: { createdAt: 'desc' }
  });
}

export async function getCourseBySlug(slug: string) {
  return prisma.course.findUnique({
    where: { slug },
    include: courseInclude
  });
}

export async function createCourse(data: Prisma.CourseCreateInput) {
  return prisma.course.create({
    data,
    include: courseInclude
  });
}

export async function attachInstructorToCourse(courseId: string, userId: string) {
  return prisma.$transaction(async (tx) => {
    await tx.enrollment.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      },
      update: {
        status: 'ACTIVE'
      },
      create: {
        courseId,
        userId
      }
    });

    return tx.auditLog.create({
      data: {
        action: 'COURSE_INSTRUCTOR_ATTACHED',
        entity: 'Course',
        entityId: courseId,
        userId,
        metadata: {
          actorId: userId,
          role: 'INSTRUCTOR'
        }
      }
    });
  });
}
