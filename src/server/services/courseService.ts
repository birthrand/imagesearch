import { cache } from 'react';
import type { EnrollmentStatus } from '@prisma/client';
import {
  attachInstructorToCourse,
  createCourse,
  enrollUserInCourse,
  getCourseBySlug,
  listCoursesWithModules
} from '@/server/repositories';

export const getCourseCatalog = cache(async () => {
  return listCoursesWithModules();
});

export async function getCourseDetails(slug: string) {
  return getCourseBySlug(slug);
}

export async function createCourseWithInstructor(
  input: Parameters<typeof createCourse>[0],
  instructorId: string
) {
  const course = await createCourse(input);
  await attachInstructorToCourse(course.id, instructorId);
  return course;
}

export async function enrollLearner(
  userId: string,
  courseId: string,
  status: EnrollmentStatus = 'ACTIVE'
) {
  return enrollUserInCourse(userId, courseId, status);
}
