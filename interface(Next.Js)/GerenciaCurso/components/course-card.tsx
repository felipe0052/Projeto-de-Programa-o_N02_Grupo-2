import Link from "next/link"
import type { Course } from "@/lib/course-data"
import { Button } from "@/components/ui/button"

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  const priceText = course.price === "free" ? "Gratuito" : `R$ ${course.price}`

  return (
    <Link href={`/course/${course.id}`}>
      <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg hover:border-primary transition-all cursor-pointer h-full flex flex-col">
        <div className="relative w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
          <img src={course.image || "/placeholder.svg"} alt={course.title} className="w-full h-full object-cover" />
          <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
            {course.level === "beginner" ? "Iniciante" : course.level === "intermediate" ? "Intermediário" : "Avançado"}
          </div>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>

          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-xs">
              {course.instructor.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{course.instructor.name}</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">{course.description}</p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              <span className="text-sm font-semibold">{course.rating}</span>
              <span className="text-xs text-muted-foreground">({course.students})</span>
            </div>
            <span className="text-xs bg-muted px-2 py-1 rounded">
              {course.type === "online" ? "🌐 Online" : "📍 Presencial"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-bold text-primary">{priceText}</span>
            <Button variant="outline" size="sm">
              Ver Detalhes
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}
