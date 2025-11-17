"use client"

import React from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import type { Course } from "@/lib/course-data"
import { getCourse, enrollCourse } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolved = React.use(params)
  const courseId = Number(resolved.id)
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(false)
  const { isAuthenticated, token, user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [enrollmentStep, setEnrollmentStep] = useState<"view" | "confirm">("view")

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const c = await getCourse(courseId, token ?? undefined)
        if (mounted) setCourse(c as Course)
      } catch {
        if (mounted) setCourse(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [courseId, token])

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Carregando…</h1>
          </div>
        </main>
      </>
    )
  }

  if (!course && !loading) {
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

  const priceText = course ? `${course.creditos} créditos` : "—"

  const isInstructorUser = user?.role === "instructor"
  const handleEnroll = () => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
    if (isInstructorUser) return
    setEnrollmentStep("confirm")
  }

  const handleConfirmEnroll = () => {
    if (!token || !user) return
    if (course && (course.vagasDisponiveis ?? 0) <= 0) {
      toast({ title: "Sem vagas", description: "Este curso está sem vagas disponíveis" })
      return
    }
    enrollCourse(courseId, user.id, token)
      .then(() => router.push(`/courses`))
      .catch((err: unknown) => {
        const message = err && typeof err === "object" && "message" in (err as any) ? String((err as any).message) : "Falha ao inscrever"
        if (message.toLowerCase().includes("sem vagas")) {
          toast({ title: "Sem vagas", description: "Este curso está sem vagas disponíveis" })
        } else {
          toast({ title: "Erro", description: message })
        }
      })
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
                    {course!.categoryNome ?? "Categoria"}
                  </span>
                  {course!.level === "beginner" || course!.level === "intermediate" ? (
                    <span className="inline-block px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-semibold">
                      {course!.level === "beginner" ? "Iniciante" : "Intermediário"}
                    </span>
                  ) : null}
                </div>
                <h1 className="text-4xl font-bold mb-4 text-balance">{course!.nome}</h1>
                <p className="text-lg text-muted-foreground mb-6 text-pretty">{course!.descricao}</p>

                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-sm text-muted-foreground">Vagas disponíveis</p>
                    <p className="font-semibold">{course!.vagasDisponiveis ?? 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Créditos</p>
                    <p className="font-semibold">{course!.creditos}</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 h-fit sticky top-24">
                <div className="mb-6 h-48 rounded-lg overflow-hidden bg-muted">
                  {course!.imagens && course!.imagens.length > 0 ? (
                    <Image src={course!.imagens[0].url} alt="Imagem do curso" width={800} height={192} className="w-full h-48 object-cover" unoptimized />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20" />
                  )}
                </div>
                <div className="mb-6">
                  <p className="text-3xl font-bold">{priceText}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Vagas disponíveis: {course!.vagasDisponiveis ?? 0}
                  </p>
                </div>

                {enrollmentStep === "view" ? (
                  <Button
                    onClick={handleEnroll}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={isInstructorUser}
                  >
                    {isInstructorUser ? "Instrutores não podem se inscrever" : isAuthenticated ? "Inscrever-se" : "Entrar para Inscrever"}
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

                {/* Content */}
                <section className="max-w-7xl mx-auto px-4 py-12">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                      <div className="bg-card border border-border rounded-lg p-8 mb-8">
                        <h2 className="text-2xl font-bold mb-4">Visão Geral</h2>
                        <p className="text-muted-foreground mb-6">{course!.descricao}</p>
                      </div>

                      <div className="bg-card border border-border rounded-lg p-8">
                        <h2 className="text-2xl font-bold mb-6">Informações</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Categoria</p>
                          <p className="font-semibold">{course!.categoryNome ?? "—"}</p>
                        </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Limite de Alunos</p>
                            <p className="font-semibold">{course!.limiteAlunos}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <p className="font-semibold">{course!.status ?? "—"}</p>
                          </div>
                        </div>
                      </div>
                    </div>

            {/* Instructor Card */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-8 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Sobre o Instrutor</h2>
                <div className="text-center mb-6">
                  <h3 className="font-bold">{course!.instructor && course!.instructor!.nome ? course!.instructor!.nome : "—"}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{course!.instructor && course!.instructor!.email ? course!.instructor!.email : "—"}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
