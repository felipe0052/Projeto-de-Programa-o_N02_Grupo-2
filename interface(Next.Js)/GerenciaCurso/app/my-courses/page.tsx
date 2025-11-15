"use client"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { mockCourses } from "@/lib/course-data"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function MyCoursesPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  if (!isAuthenticated || user?.role !== "student") {
    router.push("/login")
    return null
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Meus Cursos</h1>
            <p className="text-muted-foreground">Acompanhe seu progresso e continue aprendendo</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCourses.slice(0, 3).map((course) => (
              <Link key={course.id} href={`/my-courses/${course.id}`}>
                <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg hover:border-primary transition-all cursor-pointer">
                  <div className="relative w-full h-40 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <img
                      src={course.image || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{course.title}</h3>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Progresso</span>
                        <span className="text-sm font-semibold">{Math.floor(Math.random() * 100)}%</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">
                      {course.modules.length} módulos • {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)}{" "}
                      aulas
                    </p>

                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Continuar Assistindo
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {mockCourses.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-2xl font-bold mb-2">Nenhum curso ainda</h2>
              <p className="text-muted-foreground mb-8">Explore nosso catálogo e encontre o próximo curso para você</p>
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
