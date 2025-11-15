"use client"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { mockCourses } from "@/lib/course-data"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"

export default function EditCoursePage({ params }: { params: { id: string } }) {
  const course = mockCourses.find((c) => c.id === params.id)
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)

  if (!isAuthenticated || user?.role !== "instructor") {
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
            <Link href="/manage/courses">
              <Button>Voltar</Button>
            </Link>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link href="/manage/courses" className="text-primary hover:underline text-sm mb-8 inline-block">
            ← Voltar para Meus Cursos
          </Link>

          <div className="bg-card border border-border rounded-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Editar Curso</h1>
              <Button variant={isEditing ? "outline" : "default"} onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "Cancelar" : "Editar"}
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Título</label>
                <input
                  type="text"
                  defaultValue={course.title}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <textarea
                  defaultValue={course.description}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Categoria</label>
                  <input
                    type="text"
                    defaultValue={course.category}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Preço</label>
                  <input
                    type="text"
                    defaultValue={course.price === "free" ? "Gratuito" : `R$ ${course.price}`}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">Módulos e Aulas</h3>
                <div className="space-y-4">
                  {course.modules.map((module, mIndex) => (
                    <div key={module.id} className="border border-border rounded-lg p-4">
                      <h4 className="font-semibold mb-3">
                        Módulo {mIndex + 1}: {module.title}
                      </h4>
                      <div className="space-y-2">
                        {module.lessons.map((lesson, lIndex) => (
                          <div key={lesson.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <span className="text-sm">
                              {lIndex + 1}. {lesson.title}
                            </span>
                            <span className="text-xs text-muted-foreground">{lesson.duration}min</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {isEditing && (
                <div className="pt-6 border-t border-border">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => {
                      setIsEditing(false)
                      router.push("/manage/courses")
                    }}
                  >
                    Salvar Mudanças
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
