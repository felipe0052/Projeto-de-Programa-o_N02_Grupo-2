"use client"

import { useState, useMemo } from "react"
import { Navbar } from "@/components/navbar"
import { CourseCard } from "@/components/course-card"
import { mockCourses, courseCategories } from "@/lib/course-data"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [priceFilter, setPriceFilter] = useState("all")
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const filteredCourses = useMemo(() => {
    return mockCourses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "all" || course.category === selectedCategory
      const matchesLevel = selectedLevel === "all" || course.level === selectedLevel

      let matchesPrice = true
      if (priceFilter === "free") matchesPrice = course.price === "free"
      if (priceFilter === "paid") matchesPrice = course.price !== "free"

      return matchesSearch && matchesCategory && matchesLevel && matchesPrice
    })
  }, [searchQuery, selectedCategory, selectedLevel, priceFilter])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Explorar Cursos</h1>
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
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-card"
                >
                  <option value="all">Todas as Categorias</option>
                  {courseCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium mb-2">Nível</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-card"
                >
                  <option value="all">Todos os Níveis</option>
                  <option value="beginner">Iniciante</option>
                  <option value="intermediate">Intermediário</option>
                  <option value="advanced">Avançado</option>
                </select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium mb-2">Preço</label>
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-card"
                >
                  <option value="all">Todos os Preços</option>
                  <option value="free">Gratuito</option>
                  <option value="paid">Pago</option>
                </select>
              </div>
            </div>
          </div>

          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
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
                  setSelectedLevel("all")
                  setPriceFilter("all")
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
