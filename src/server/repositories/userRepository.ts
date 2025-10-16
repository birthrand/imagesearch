import type { Role } from '@prisma/client';
import prisma from '@/lib/prisma';

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  profile: {
    firstName: string;
    lastName: string;
    bio?: string | null;
    avatarUrl?: string | null;
  };
  roleNames?: string[];
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      profile: true,
      roles: { include: { role: true } }
    }
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      profile: true,
      roles: { include: { role: true } }
    }
  });
}

export async function listUsersByRole(roleName: string) {
  return prisma.user.findMany({
    where: {
      roles: {
        some: {
          role: {
            name: roleName
          }
        }
      }
    },
    include: {
      profile: true,
      roles: { include: { role: true } }
    },
    orderBy: { createdAt: 'asc' }
  });
}

export async function createUserWithProfile(input: CreateUserInput) {
  const roleNames = input.roleNames ?? [];

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: input.email,
        passwordHash: input.passwordHash,
        profile: {
          create: {
            firstName: input.profile.firstName,
            lastName: input.profile.lastName,
            bio: input.profile.bio,
            avatarUrl: input.profile.avatarUrl
          }
        }
      }
    });

    if (roleNames.length > 0) {
      const roles = await tx.role.findMany({
        where: {
          name: {
            in: roleNames
          }
        }
      });

      if (roles.length !== roleNames.length) {
        const missing = roleNames.filter(
          (name) => !roles.some((role) => role.name === name)
        );

        throw new Error(`Unable to assign missing roles: ${missing.join(', ')}`);
      }

      await tx.userRole.createMany({
        data: roles.map((role) => ({
          userId: user.id,
          roleId: role.id
        })),
        skipDuplicates: true
      });
    }

    return tx.user.findUnique({
      where: { id: user.id },
      include: {
        profile: true,
        roles: { include: { role: true } }
      }
    });
  });
}

export async function upsertRole(name: string, description?: string | null): Promise<Role> {
  return prisma.role.upsert({
    where: { name },
    update: {
      description: description ?? undefined
    },
    create: {
      name,
      description: description ?? undefined
    }
  });
}

export async function listUsersWithEnrollments() {
  return prisma.user.findMany({
    include: {
      profile: true,
      enrollments: {
        include: {
          course: true
        }
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  });
}
