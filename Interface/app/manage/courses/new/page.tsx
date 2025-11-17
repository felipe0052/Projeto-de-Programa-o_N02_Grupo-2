"use client"

import React, { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { getCategories, createCourse, createCategory, type CategoryResponse } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { uploadCourseImages } from "@/lib/images"

export default function NewCoursePage() {
  const { isAuthenticated, user, token } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: 0 as number,
    capacity: 0 as number,
    valor: "0.00" as string,
    creditos: "1" as string,
    status: "rascunho" as string,
  })
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [loadingCats, setLoadingCats] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [newCategory, setNewCategory] = useState({ nome: "", descricao: "" })
  const [images, setImages] = useState<File[]>([])

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== "instructor" && user?.role !== "admin")) {
      router.push("/login")
    }
  }, [isAuthenticated, user, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.title || formData.categoryId === 0 || Number(formData.capacity) <= 0) {
        toast({ title: "Preencha os campos obrigatórios", description: "Título, Categoria e Capacidade (> 0) são obrigatórios" })
        return
      }
    }
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handlePublish = async () => {
    if (!token || !user?.id) return
    const missing: string[] = []
    if (!formData.title) missing.push("Título do Curso")
    if (formData.categoryId === 0) missing.push("Categoria")
    if (Number(formData.capacity) <= 0) missing.push("Capacidade (> 0)")
    if (Number(formData.creditos) < 1) missing.push("Créditos (≥ 1)")
    if (!formData.valor || isNaN(Number(formData.valor))) missing.push("Valor (R$)")
    if (missing.length > 0) {
      toast({ title: "Faltam informações", description: `Informe: ${missing.join(", ")}` })
      return
    }
    try {
      const payload = {
        nome: formData.title,
        descricao: formData.description || null,
        limiteAlunos: Number(formData.capacity),
        valor: Number(formData.valor || 0),
        creditos: Number(formData.creditos || 1),
        horario: null,
        status: formData.status || null,
        categoryId: Number(formData.categoryId),
        instructorId: user.role === "instructor" ? user.id : undefined,
      }
      const created = await createCourse(payload, token)
      toast({ title: "Curso criado", description: `#${created.id} ${created.nome}` })
      if (images.length > 0) {
        try {
          const uploaded = await uploadCourseImages(created.id, images, token)
          console.debug("[new-course] uploaded", uploaded)
        } catch (e: any) {
          toast({ title: "Erro ao enviar imagens", description: typeof e?.message === "string" ? e.message : "Falha ao enviar imagens" })
        }
      }
      router.push("/manage/courses")
    } catch (err: any) {
      const message = typeof err?.message === "string" ? err.message : "Falha ao criar curso"
      toast({ title: "Erro", description: message })
    }
  }

  const loadCategories = async () => {
    if (!token) return
    setLoadingCats(true)
    try {
      const cats = await getCategories(token)
      setCategories(cats)
      if (cats.length > 0 && formData.categoryId === 0) {
        setFormData((p) => ({ ...p, categoryId: cats[0].id }))
      }
      if (cats.length === 0) {
        setShowCategoryModal(true)
      }
    } catch (err: any) {
      const message = typeof err?.message === "string" ? err.message : "Falha ao carregar categorias"
      toast({ title: "Erro", description: message })
    } finally {
      setLoadingCats(false)
    }
  }

  if (!isAuthenticated || (user?.role !== "instructor" && user?.role !== "admin")) {
    return null
  }

  useEffect(() => {
    loadCategories()
  }, [])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Link href="/manage/courses" className="text-primary hover:underline text-sm mb-8 inline-block">
            ← Voltar para Meus Cursos
          </Link>

          <div className="bg-card border border-border rounded-lg p-8">
            {/* Progress Steps */}
            <div className="mb-12">
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        step === currentStep
                          ? "bg-primary text-primary-foreground"
                          : step < currentStep
                            ? "bg-accent text-accent-foreground"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step}
                    </div>
                    {step < 3 && <div className="w-8 h-1 bg-border"></div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Informações Básicas</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Título do Curso</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Digite o título do seu curso"
                      className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Descrição</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Descreva seu curso"
                      rows={4}
                      className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Imagens do Curso</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const files = Array.from(e.target.files ?? [])
                        setImages(files)
                      }}
                      className="w-full px-4 py-2 border border-input rounded-lg bg-background"
                    />
                    {images.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-2">{images.length} arquivo(s) selecionado(s)</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Categoria</label>
                      {categories.length > 0 ? (
                        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                          <select
                            name="categoryId"
                            value={String(formData.categoryId)}
                            onChange={(e) => setFormData((p) => ({ ...p, categoryId: Number(e.target.value) }))}
                            className="w-full min-w-0 px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                          >
                            {loadingCats ? (
                              <option>Carregando...</option>
                            ) : (
                              categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.nome}
                                </option>
                              ))
                            )}
                          </select>
                          <Button variant="outline" onClick={() => setShowCategoryModal(true)}>Nova Categoria</Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Nenhuma categoria disponível.</span>
                          <Button onClick={() => setShowCategoryModal(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">Criar Categoria</Button>
                        </div>
                      )}
                    </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Status do Curso</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                  >
                    <option value="rascunho">Rascunho</option>
                    <option value="ativo">Ativo</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Valor (R$)</label>
                  <input
                    type="number"
                    name="valor"
                    step="0.01"
                    value={formData.valor}
                    onChange={handleInputChange}
                    placeholder="Ex: 99.90"
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Créditos</label>
                  <input
                    type="number"
                    name="creditos"
                    value={formData.creditos}
                    onChange={handleInputChange}
                    placeholder="Ex: 10"
                    min={1}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                  />
                </div>
              </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Capacidade (alunos)</label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      placeholder="Ex: 100"
                      className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Créditos e Valor */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Créditos e Valor</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Créditos</label>
                    <input
                      type="number"
                      name="creditos"
                      value={formData.creditos}
                      onChange={handleInputChange}
                      placeholder="Ex: 10"
                      min={1}
                      className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Valor (R$)</label>
                    <input
                      type="number"
                      name="valor"
                      step="0.01"
                      value={formData.valor}
                      onChange={handleInputChange}
                      placeholder="Ex: 99.90"
                      className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Confirm */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Revisar e Publicar</h2>
                <div className="space-y-4 p-6 bg-muted/50 rounded-lg border border-border">
                  <div>
                    <p className="text-sm text-muted-foreground">Título</p>
                    <p className="font-semibold">{formData.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Descrição</p>
                    <p className="text-sm">{formData.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Categoria</p>
                      <p className="font-semibold">{categories.find((c) => c.id === formData.categoryId)?.nome ?? ""}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Capacidade</p>
                      <p className="font-semibold">{formData.capacity}</p>
                    </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Créditos</p>
                    <p className="font-semibold">{formData.creditos}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valor</p>
                    <p className="font-semibold">R$ {formData.valor}</p>
                  </div>
                </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-semibold">{formData.status}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8 pt-8 border-t border-border">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex-1 bg-transparent"
              >
                Voltar
              </Button>
              {currentStep < 3 ? (
                <Button onClick={handleNext} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                  Próximo
                </Button>
              ) : (
                <Button
                  onClick={handlePublish}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Publicar Curso
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>

      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Nova Categoria</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Nome</label>
                <input
                  type="text"
                  value={newCategory.nome}
                  onChange={(e) => setNewCategory((p) => ({ ...p, nome: e.target.value }))}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <textarea
                  rows={3}
                  value={newCategory.descricao}
                  onChange={(e) => setNewCategory((p) => ({ ...p, descricao: e.target.value }))}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setShowCategoryModal(false)} className="flex-1">Cancelar</Button>
              <Button
                onClick={async () => {
                  if (!token) return
                  try {
                    const created = await createCategory({ nome: newCategory.nome, descricao: newCategory.descricao || undefined }, token)
                    toast({ title: "Categoria criada", description: created.nome })
                    setShowCategoryModal(false)
                    setNewCategory({ nome: "", descricao: "" })
                    await loadCategories()
                    setFormData((p) => ({ ...p, categoryId: created.id }))
                  } catch (err: any) {
                    const message = typeof err?.message === "string" ? err.message : "Falha ao criar categoria"
                    toast({ title: "Erro", description: message })
                  }
                }}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Criar Categoria
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
