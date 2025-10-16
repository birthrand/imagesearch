import type { Enrollment, EnrollmentStatus } from '@prisma/client';
import prisma from '@/lib/prisma';

export async function enrollUserInCourse(
  userId: string,
  courseId: string,
  status: EnrollmentStatus = 'ACTIVE'
): Promise<Enrollment> {
  return prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId,
        courseId
      }
    },
    update: {
      status
    },
    create: {
      userId,
      courseId,
      status
    }
  });
}

export async function listEnrollmentsForCourse(courseId: string) {
  return prisma.enrollment.findMany({
    where: { courseId },
    include: {
      user: {
        include: {
          profile: true,
          roles: { include: { role: true } }
        }
      },
      grades: true
    },
    orderBy: { enrolledAt: 'asc' }
  });
}

export async function listEnrollmentsForUser(userId: string) {
  return prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          modules: {
            select: { id: true, title: true }
          }
        }
      },
      grades: true
    },
    orderBy: { enrolledAt: 'desc' }
  });
}
