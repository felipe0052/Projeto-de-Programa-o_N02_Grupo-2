"use client"

import { useEffect, useState, useMemo } from "react"
import { Navbar } from "@/components/navbar"
import { CourseCard } from "@/components/course-card"
import type { Course } from "@/lib/course-data"
import { getCategories, getCourses, type CategoryResponse } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { listCourseImages } from "@/lib/images"

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all")
  
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [imageByCourseId, setImageByCourseId] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(false)
  const { isAuthenticated, token, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])


  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        if (!token) return
        const [cats, crs] = await Promise.all([
          getCategories(token ?? undefined),
          getCourses({}, token ?? undefined),
        ])
        if (!mounted) return
        setCategories(cats)
        setCourses(crs as Course[])
        const pairs = await Promise.all((crs as Course[]).map(async (c) => {
          try {
            const imgs = await listCourseImages(c.id, token)
            const first = imgs[0]?.url
            return [c.id, first] as const
          } catch {
            return [c.id, undefined] as const
          }
        }))
        const map: Record<number, string> = {}
        pairs.forEach(([id, url]) => { if (url) map[id] = url })
        setImageByCourseId(map)
      } catch (err: any) {
        const status = typeof err?.status === "number" ? err.status : 0
        const message = typeof err?.message === "string" ? err.message : "Erro ao carregar cursos"
        if (status === 401 || status === 403) {
          router.push("/login")
        } else {
          toast({ title: "Falha ao carregar cursos", description: message })
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [token])

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.descricao ?? "").toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "all" || course.categoryId === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory, courses])

  if (!isAuthenticated) return null

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold">Explorar Cursos</h1>
              {(user?.role === "instructor" || user?.role === "admin") && (
                <Link href="/manage/courses/new">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Criar Cursos</Button>
                </Link>
              )}
            </div>
            <p className="text-muted-foreground mb-8">Encontre o curso perfeito para você</p>

            <div className="relative mb-8">
              <input
                type="text"
                placeholder="Buscar cursos, instrutores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-card"
              />
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium mb-2">Categoria</label>
                <select
                  value={selectedCategory === "all" ? "all" : String(selectedCategory)}
                  onChange={(e) =>
                    setSelectedCategory(e.target.value === "all" ? "all" : Number(e.target.value))
                  }
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-card"
                >
                  <option value="all">Todas as Categorias</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nome}
                    </option>
                  ))}
                </select>
              </div>

              
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">Carregando...</div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} firstImageUrl={imageByCourseId[course.id]} />
          ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold mb-2">Nenhum curso encontrado</h2>
              <p className="text-muted-foreground mb-8">Tente ajustar seus filtros de busca</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
