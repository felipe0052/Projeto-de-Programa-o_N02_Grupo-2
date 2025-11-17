"use client"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getCourses, type CourseResponse } from "@/lib/api"
import { CourseCard } from "@/components/course-card"
import { useToast } from "@/hooks/use-toast"

export default function MyCoursesPage() {
  const { isAuthenticated, user, token } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [courses, setCourses] = useState<CourseResponse[] | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "student") {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])
  if (!isAuthenticated || user?.role !== "student") {
    return null
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const list = await getCourses({ inscritoPor: user!.id }, token ?? undefined)
        setCourses(list)
      } catch (err: any) {
        toast({ title: "Erro", description: typeof err?.message === "string" ? err.message : "Falha ao carregar Meus Cursos" })
        setCourses([])
      } finally {
        setLoading(false)
      }
    }
    if (token) load()
  }, [user?.id, token])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Meus Cursos</h1>
            <p className="text-muted-foreground">Acompanhe seu progresso e continue aprendendo</p>
          </div>
          {loading ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold mb-2">Carregando…</h2>
            </div>
          ) : courses && courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((c) => (
                <CourseCard key={c.id} course={c as any} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-2xl font-bold mb-2">Nenhuma inscrição encontrada</h2>
              <p className="text-muted-foreground mb-8">Faça sua inscrição em um curso para aparecer aqui</p>
              <Link href="/courses">
                <Button>Explorar Cursos</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
