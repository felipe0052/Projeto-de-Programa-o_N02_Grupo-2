"use client"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { mockCourses } from "@/lib/course-data"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const course = mockCourses.find((c) => c.id === params.id)
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [enrollmentStep, setEnrollmentStep] = useState<"view" | "confirm">("view")

  if (!course) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Curso não encontrado</h1>
            <Button onClick={() => router.push("/courses")}>Voltar aos Cursos</Button>
          </div>
        </main>
      </>
    )
  }

  const priceText = course.price === "free" ? "Gratuito" : `R$ ${course.price}`

  const handleEnroll = () => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
    setEnrollmentStep("confirm")
  }

  const handleConfirmEnroll = () => {
    router.push(`/my-courses/${course.id}`)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 to-accent/10 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
              <div className="md:col-span-2">
                <div className="flex gap-2 mb-4">
                  <span className="inline-block px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-semibold">
                    {course.category}
                  </span>
                  <span className="inline-block px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-semibold">
                    {course.level === "beginner"
                      ? "Iniciante"
                      : course.level === "intermediate"
                        ? "Intermediário"
                        : "Avançado"}
                  </span>
                </div>
                <h1 className="text-4xl font-bold mb-4 text-balance">{course.title}</h1>
                <p className="text-lg text-muted-foreground mb-6 text-pretty">{course.description}</p>

                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-sm text-muted-foreground">Instrutor</p>
                    <p className="font-semibold">{course.instructor.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Classificação</p>
                    <p className="font-semibold">
                      ★ {course.rating} ({course.students} alunos)
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tipo</p>
                    <p className="font-semibold">{course.type === "online" ? "🌐 Online" : "📍 Presencial"}</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 h-fit sticky top-24">
                <div className="mb-6 h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="mb-6">
                  <p className="text-3xl font-bold">{priceText}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {course.modules.length} módulos • {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)}{" "}
                    aulas
                  </p>
                </div>

                {enrollmentStep === "view" ? (
                  <Button
                    onClick={handleEnroll}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isAuthenticated ? "Inscrever-se" : "Entrar para Inscrever"}
                  </Button>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground mb-4">Tem certeza que deseja se inscrever?</p>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setEnrollmentStep("view")} className="flex-1">
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleConfirmEnroll}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Confirmar
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Content Tabs */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {/* Overview Tab */}
              <div className="bg-card border border-border rounded-lg p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Visão Geral</h2>
                <p className="text-muted-foreground mb-6">{course.description}</p>
                <h3 className="text-lg font-bold mb-3">O que você aprenderá</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span>Conceitos fundamentais da plataforma</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span>Projetos práticos e reais</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span>Melhores práticas da indústria</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span>Certificado de conclusão</span>
                  </li>
                </ul>
              </div>

              {/* Content Tab */}
              <div className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Conteúdo do Curso</h2>
                <div className="space-y-4">
                  {course.modules.map((module, moduleIndex) => (
                    <div key={module.id} className="border border-border rounded-lg overflow-hidden">
                      <div className="bg-muted/50 p-4 flex items-center justify-between cursor-pointer hover:bg-muted">
                        <div>
                          <h3 className="font-bold">
                            Módulo {moduleIndex + 1}: {module.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {module.lessons.length} aulas • {module.lessons.reduce((acc, l) => acc + l.duration, 0)}{" "}
                            minutos
                          </p>
                        </div>
                      </div>
                      <div className="divide-y">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div key={lesson.id} className="p-4 flex items-start gap-3">
                            <span className="text-muted-foreground">▶</span>
                            <div className="flex-1">
                              <p className="font-medium">
                                {lessonIndex + 1}. {lesson.title}
                              </p>
                              <p className="text-sm text-muted-foreground">{lesson.duration} minutos</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Instructor Card */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-8 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Sobre o Instrutor</h2>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center text-2xl">
                    {course.instructor.name.charAt(0)}
                  </div>
                  <h3 className="font-bold">{course.instructor.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{course.instructor.bio}</p>
                </div>
                <div className="space-y-3 pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">OUTROS CURSOS</p>
                    <p className="font-bold">12 cursos</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">ALUNOS</p>
                    <p className="font-bold">8.200+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
