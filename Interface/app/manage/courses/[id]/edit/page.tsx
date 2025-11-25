"use client"

import React from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import type { Course } from "@/lib/course-data"
import { getCourse, updateCourse, type CourseCreateRequest } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { listCourseImages, uploadCourseImages, deleteCourseImage, type CourseImageResponse } from "@/lib/images"

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const resolved = React.use(params)
  const courseId = Number(resolved.id)
  const [course, setCourse] = useState<Course | null>(null)
  const { isAuthenticated, user, token } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState<CourseCreateRequest | null>(null)
  const [images, setImages] = useState<CourseImageResponse[]>([])
  const [newImages, setNewImages] = useState<File[]>([])

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== "instructor" && user?.role !== "admin")) {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      if (!isAuthenticated || (user?.role !== "instructor" && user?.role !== "admin") || !token) return
      const c = await getCourse(courseId, token ?? undefined)
      if (!mounted) return
      setCourse(c as Course)
      setForm({
        nome: c.nome,
        descricao: c.descricao ?? "",
        limiteAlunos: c.limiteAlunos,
        creditos: Number((c as Course).creditos),
        categoryId: c.categoryId,
        instructorId: c.instructorId ?? undefined,
        status: c.status ?? undefined,
        prerequisiteIds: c.prerequisiteIds ?? undefined,
      })
      try {
        const imgs = await listCourseImages(courseId, token)
        console.debug("[edit-course] list images", imgs)
        setImages(imgs)
      } catch {}
    }
    load()
    return () => {
      mounted = false
    }
  }, [courseId, isAuthenticated, user, token])

  if (!isAuthenticated || (user?.role !== "instructor" && user?.role !== "admin")) return null

  if (!course || !form) {
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
                  value={form.nome}
                  onChange={(e) => setForm({ ...form!, nome: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <textarea
                  value={form.descricao ?? ""}
                  onChange={(e) => setForm({ ...form!, descricao: e.target.value })}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Categoria</label>
                  <input
                    type="number"
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form!, categoryId: Number(e.target.value) })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Créditos</label>
                  <input
                    type="number"
                    value={form.creditos}
                    onChange={(e) => setForm({ ...form!, creditos: Number(e.target.value) })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Limite de Alunos</label>
                  <input
                    type="number"
                    value={form.limiteAlunos}
                    onChange={(e) => setForm({ ...form!, limiteAlunos: Number(e.target.value) })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background disabled:opacity-50"
                  />
                </div>
              </div>

              <div></div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Imagens do Curso</h2>
                <div className="grid grid-cols-3 gap-4">
                  {images.map((img) => (
                    <div key={img.id} className="border border-border rounded-lg p-2 flex flex-col items-center gap-2">
                      <Image src={img.url} alt="Imagem do curso" width={200} height={120} className="object-cover w-full h-24" unoptimized />
                      {isEditing && (
                        <Button variant="outline" onClick={async () => {
                          if (!token) return
                          await deleteCourseImage(courseId, img.id, token)
                          setImages((prev) => prev.filter((i) => i.id !== img.id))
                        }}>Remover</Button>
                      )}
                    </div>
                  ))}
                </div>
                {isEditing && (
                  <div className="pt-2">
                    <label className="block text-sm font-medium mb-2">Adicionar novas imagens</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const files = Array.from(e.target.files ?? [])
                        setNewImages(files)
                      }}
                      className="w-full px-4 py-2 border border-input rounded-lg bg-background"
                    />
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="pt-6 border-t border-border">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={async () => {
                      if (!form || !token) return
                      const updated = await updateCourse(courseId, form, token)
                      setCourse(updated as Course)
                      if (newImages.length > 0) {
                        const uploaded = await uploadCourseImages(courseId, newImages, token)
                        console.debug("[edit-course] uploaded", uploaded)
                        setImages((prev) => [...prev, ...uploaded])
                        setNewImages([])
                      }
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
