import type { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

const assignmentInclude = {
  lesson: {
    select: {
      id: true,
      title: true,
      module: {
        select: {
          id: true,
          course: {
            select: { id: true, title: true, slug: true }
          }
        }
      }
    }
  },
  submissions: true,
  grades: true
} satisfies Prisma.AssignmentInclude;

export type AssignmentWithRelations = Prisma.AssignmentGetPayload<{
  include: typeof assignmentInclude;
}>;

export async function createAssignment(data: Prisma.AssignmentCreateInput) {
  return prisma.assignment.create({
    data,
    include: assignmentInclude
  });
}

export async function createOrUpdateSubmission(
  assignmentId: string,
  studentId: string,
  content: Prisma.JsonValue | null
) {
  return prisma.submission.upsert({
    where: {
      assignmentId_studentId: {
        assignmentId,
        studentId
      }
    },
    update: {
      submittedAt: new Date(),
      content: content ?? undefined
    },
    create: {
      assignment: { connect: { id: assignmentId } },
      student: { connect: { id: studentId } },
      content: content ?? undefined
    },
    include: {
      assignment: {
        select: {
          id: true,
          title: true
        }
      },
      student: {
        select: {
          id: true,
          email: true
        }
      }
    }
  });
}

export interface GradeInput {
  enrollmentId: string;
  assignmentId?: string;
  quizId?: string;
  submissionId?: string;
  score: number;
  maxScore: number;
  gradedById?: string | null;
}

export async function recordGrade(input: GradeInput) {
  const existing = await prisma.grade.findFirst({
    where: {
      enrollmentId: input.enrollmentId,
      assignmentId: input.assignmentId ?? null,
      quizId: input.quizId ?? null,
      submissionId: input.submissionId ?? null
    }
  });

  if (existing) {
    return prisma.grade.update({
      where: { id: existing.id },
      data: {
        score: input.score,
        maxScore: input.maxScore,
        gradedAt: new Date(),
        gradedById: input.gradedById ?? undefined
      }
    });
  }

  return prisma.grade.create({
    data: {
      enrollment: { connect: { id: input.enrollmentId } },
      assignment: input.assignmentId
        ? { connect: { id: input.assignmentId } }
        : undefined,
      quiz: input.quizId ? { connect: { id: input.quizId } } : undefined,
      submission: input.submissionId
        ? { connect: { id: input.submissionId } }
        : undefined,
      score: input.score,
      maxScore: input.maxScore,
      gradedBy: input.gradedById
        ? { connect: { id: input.gradedById } }
        : undefined
    }
  });
}
