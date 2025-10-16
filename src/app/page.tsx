import { Suspense } from 'react';
import { getCourseCatalog } from '@/server/services/courseService';

async function CourseCatalog() {
  let courses = [] as Awaited<ReturnType<typeof getCourseCatalog>>;
  let hasDatabase = true;
  let errorMessage: string | undefined;

  try {
    courses = await getCourseCatalog();
  } catch (error) {
    hasDatabase = false;
    errorMessage = error instanceof Error ? error.message : 'Unable to reach the database.';
  }

  if (!hasDatabase) {
    return (
      <div className="card">
        <h2>Database not connected</h2>
        <p>
          Prisma is configured for PostgreSQL. Run <code>docker-compose up</code> and execute the
          migration &amp; seed commands to explore the sample data set.
        </p>
        {errorMessage && <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>{errorMessage}</p>}
      </div>
    );
  }

  if (!courses.length) {
    return (
      <div className="card">
        <h2>No courses yet</h2>
        <p>Seed the database to explore the learning platform domain model in action.</p>
      </div>
    );
  }

  return (
    <div className="grid">
      {courses.map((course) => (
        <article key={course.id} className="card">
          <div className="badge">{course.modules.length} modules</div>
          <h2>{course.title}</h2>
          {course.description && <p>{course.description}</p>}
          <section>
            <h3>Curriculum</h3>
            <ul>
              {course.modules.map((module) => (
                <li key={module.id}>
                  <strong>{module.title}</strong>
                  <ul>
                    {module.lessons.map((lesson) => (
                      <li key={lesson.id}>
                        {lesson.title} · {lesson.contentBlocks.length} content blocks ·{' '}
                        {lesson.assignments.length} assignments · {lesson.quizzes.length} quizzes
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        </article>
      ))}
    </div>
  );
}

export default async function HomePage() {
  return (
    <Suspense fallback={<div className="card">Loading course catalog…</div>}>
      {/* @ts-expect-error Async Server Component */}
      <CourseCatalog />
    </Suspense>
  );
}
