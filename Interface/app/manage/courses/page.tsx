"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import type { Course } from "@/lib/course-data"
import { getCourses, deleteCourse } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

export default function ManageCoursesPage() {
  const { isAuthenticated, user, token } = useAuth()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [showNewCourseModal, setShowNewCourseModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== "instructor" && user?.role !== "admin")) {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      if (!isAuthenticated || (user?.role !== "instructor" && user?.role !== "admin") || !token) return
      setLoading(true)
      try {
        const crs = user?.role === "admin"
          ? await getCourses({}, token ?? undefined)
          : await getCourses({ instrutor: user!.id }, token ?? undefined)
        if (mounted) setCourses(crs as Course[])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [isAuthenticated, user, token])

  if (!isAuthenticated || (user?.role !== "instructor" && user?.role !== "admin")) return null

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
            <Link href="/manage/courses/new">
                              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Criar Cursos</Button>
                 </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total de Cursos", value: courses.length },
              { label: "Vagas Disponíveis", value: courses.reduce((acc, c) => acc + (c.vagasDisponiveis ?? 0), 0) },
              { label: "Capacidade Total", value: courses.reduce((acc, c) => acc + c.limiteAlunos, 0) },
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
                  <th className="px-6 py-4 text-left text-sm font-semibold">Créditos</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-muted/50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold">{course.nome}</p>
                        <p className="text-sm text-muted-foreground">{course.categoryNome ?? "—"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{course.inscritosAtivos ?? 0}</td>
                    <td className="px-6 py-4 text-sm">{course.creditos ?? "—"}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-block px-3 py-1 bg-muted text-foreground rounded-full text-xs font-semibold">
                        {course.status ?? "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <Link href={`/manage/courses/${course.id}/edit`}>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </Link>
                      <Link href={`/course/${course.id}`}> <Button variant="outline" size="sm">
                                                                                   Ver
                                                                                 </Button> </Link>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!(user?.role === "admin" || course.instructorId === user?.id)}
                        onClick={() => {
                          const canDelete = user?.role === "admin" || course.instructorId === user?.id
                          if (!canDelete) return
                          setDeleteTarget(course)
                          setDeleteOpen(true)
                        }}
                      >
                        Apagar
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

        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Apagar Curso</AlertDialogTitle>
              <AlertDialogDescription>
                {deleteTarget ? `Tem certeza que deseja apagar "${deleteTarget.nome}"? Esta ação não pode ser desfeita.` : "Tem certeza que deseja apagar este curso?"}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteOpen(false)}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  if (!token || !deleteTarget) return
                  try {
                    await deleteCourse(deleteTarget.id, token)
                    setCourses((prev) => prev.filter((c) => c.id !== deleteTarget.id))
                    toast({ title: "Curso apagado", description: deleteTarget.nome })
                  } catch (err: any) {
                    const message = typeof err?.message === "string" ? err.message : "Falha ao apagar curso"
                    toast({ title: "Erro", description: message })
                  } finally {
                    setDeleteOpen(false)
                    setDeleteTarget(null)
                  }
                }}
              >
                Apagar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </>
  )
}
