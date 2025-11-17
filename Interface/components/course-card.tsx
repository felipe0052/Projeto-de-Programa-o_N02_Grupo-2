import Link from "next/link"
import type { Course } from "@/lib/course-data"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface CourseCardProps {
  course: Course
  firstImageUrl?: string
}

export function CourseCard({ course, firstImageUrl }: CourseCardProps) {
  const priceText = `${course.creditos} créditos`
  const imgUrl = firstImageUrl ?? course.imagens?.[0]?.url
  if (typeof window !== "undefined") {
    console.debug("[course-card]", { id: course.id, imgUrl })
  }

  return (
    <Link href={`/course/${course.id}`}>
      <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg hover:border-primary transition-all cursor-pointer h-full flex flex-col">
        <div className="relative w-full h-48 bg-muted">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt="Imagem do curso"
              width={800}
              height={192}
              className="w-full h-48 object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20" />
          )}
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.nome}</h3>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs bg-muted px-2 py-1 rounded">{course.categoryNome ?? "—"}</span>
            {course.status && <span className="text-xs bg-muted px-2 py-1 rounded">{course.status}</span>}
          </div>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">{course.descricao}</p>

          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-muted-foreground">
              Vagas: {course.vagasDisponiveis ?? 0}
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
