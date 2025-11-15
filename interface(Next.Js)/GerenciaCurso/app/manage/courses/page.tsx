"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { mockCourses } from "@/lib/course-data"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ManageCoursesPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [courses, setCourses] = useState(mockCourses)
  const [showNewCourseModal, setShowNewCourseModal] = useState(false)

  if (!isAuthenticated || user?.role !== "instructor") {
    router.push("/login")
    return null
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-bold mb-2">Gerenciar Cursos</h1>
              <p className="text-muted-foreground">Crie e gerencie seus cursos online</p>
            </div>
            <Button
              onClick={() => setShowNewCourseModal(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              + Criar Novo Curso
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total de Cursos", value: courses.length },
              { label: "Alunos Totais", value: courses.reduce((acc, c) => acc + c.students, 0) },
              {
                label: "Classificação Média",
                value: (courses.reduce((acc, c) => acc + c.rating, 0) / courses.length).toFixed(1),
              },
              { label: "Receita Este Mês", value: "R$ 2.450" },
            ].map((stat, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Courses Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Curso</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Alunos</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Avaliação</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Preço</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-muted/50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold">{course.title}</p>
                        <p className="text-sm text-muted-foreground">{course.category}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{course.students}</td>
                    <td className="px-6 py-4 text-sm">★ {course.rating}</td>
                    <td className="px-6 py-4 text-sm">{course.price === "free" ? "Gratuito" : `R$ ${course.price}`}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        Publicado
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <Link href={`/manage/courses/${course.id}/edit`}>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* New Course Modal */}
        {showNewCourseModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-card border border-border rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-6">Criar Novo Curso</h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Título do Curso</label>
                  <input
                    type="text"
                    placeholder="Ex: React Avançado"
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Categoria</label>
                  <input
                    type="text"
                    placeholder="Ex: Desenvolvimento Web"
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Descrição</label>
                  <textarea
                    placeholder="Descreva seu curso..."
                    rows={3}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setShowNewCourseModal(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    setShowNewCourseModal(false)
                    router.push("/manage/courses/new")
                  }}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Continuar
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
