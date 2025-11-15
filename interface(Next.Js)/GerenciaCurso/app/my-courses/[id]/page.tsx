"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { mockCourses } from "@/lib/course-data"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function CourseLessonPage({ params }: { params: { id: string } }) {
  const course = mockCourses.find((c) => c.id === params.id)
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])

  if (!isAuthenticated || user?.role !== "student") {
    router.push("/login")
    return null
  }

  if (!course) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Curso não encontrado</h1>
            <Link href="/my-courses">
              <Button>Voltar aos Meus Cursos</Button>
            </Link>
          </div>
        </main>
      </>
    )
  }

  const allLessons = course.modules.flatMap((m) => m.lessons)
  const currentLesson = allLessons[currentLessonIndex]
  const totalLessons = allLessons.length
  const progress = Math.round((completedLessons.length / totalLessons) * 100)

  const handleMarkComplete = () => {
    if (!completedLessons.includes(currentLesson.id)) {
      setCompletedLessons([...completedLessons, currentLesson.id])
    }
    if (currentLessonIndex < allLessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header with progress */}
          <div className="mb-8">
            <Link href="/my-courses" className="text-primary hover:underline text-sm mb-4 inline-block">
              ← Voltar aos Meus Cursos
            </Link>
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Progresso do Curso</span>
              <span className="text-sm font-semibold">{progress}%</span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Video Player */}
              <div className="bg-card border border-border rounded-lg overflow-hidden mb-8">
                <div className="w-full h-96 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-6xl">
                  🎥
                </div>
              </div>

              {/* Lesson Info */}
              <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">{currentLesson.title}</h2>
                  <p className="text-muted-foreground">
                    Aula {currentLessonIndex + 1} de {totalLessons} • {currentLesson.duration} minutos
                  </p>
                </div>

                <p className="text-muted-foreground mb-6">{currentLesson.content}</p>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentLessonIndex(Math.max(0, currentLessonIndex - 1))}
                    disabled={currentLessonIndex === 0}
                  >
                    ← Aula Anterior
                  </Button>
                  <Button
                    onClick={handleMarkComplete}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {completedLessons.includes(currentLesson.id) ? "✓ Concluída" : "Marcar como Concluída"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentLessonIndex(Math.min(totalLessons - 1, currentLessonIndex + 1))}
                    disabled={currentLessonIndex === totalLessons - 1}
                  >
                    Próxima Aula →
                  </Button>
                </div>

                {currentLessonIndex === totalLessons - 1 && completedLessons.length === totalLessons && (
                  <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <p className="text-center font-bold">Parabéns! Você concluiu o curso!</p>
                    <div className="text-center mt-2">
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        Gerar Certificado
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Comments Section */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Comentários</h3>
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="border-b border-border pb-4">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm">
                          A
                        </div>
                        <div>
                          <p className="font-semibold text-sm">Aluno {i}</p>
                          <p className="text-xs text-muted-foreground">Há 2 dias</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">Ótima aula! Ficou bem claro.</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - Course Outline */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-4 sticky top-24">
                <h3 className="font-bold mb-4">Conteúdo do Curso</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {course.modules.map((module, mIndex) => (
                    <div key={module.id}>
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                        Módulo {mIndex + 1}: {module.title}
                      </p>
                      <div className="space-y-1">
                        {module.lessons.map((lesson, lIndex) => {
                          const globalLessonIndex = allLessons.findIndex((l) => l.id === lesson.id)
                          const isCompleted = completedLessons.includes(lesson.id)
                          const isCurrent = currentLessonIndex === globalLessonIndex

                          return (
                            <button
                              key={lesson.id}
                              onClick={() => setCurrentLessonIndex(globalLessonIndex)}
                              className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                                isCurrent
                                  ? "bg-primary text-primary-foreground"
                                  : isCompleted
                                    ? "bg-accent/20 text-foreground"
                                    : "hover:bg-muted"
                              }`}
                            >
                              <span className="mr-2">{isCompleted ? "✓" : isCurrent ? "▶" : "◯"}</span>
                              {lesson.title}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
