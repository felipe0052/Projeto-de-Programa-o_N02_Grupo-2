"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function NewCoursePage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    level: "beginner",
    type: "online",
    price: "free",
  })

  if (!isAuthenticated || user?.role !== "instructor") {
    router.push("/login")
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handlePublish = () => {
    router.push("/manage/courses")
  }

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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Categoria</label>
                      <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        placeholder="Ex: Desenvolvimento Web"
                        className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Nível</label>
                      <select
                        name="level"
                        value={formData.level}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                      >
                        <option value="beginner">Iniciante</option>
                        <option value="intermediate">Intermediário</option>
                        <option value="advanced">Avançado</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Format and Price */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Formato e Preço</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tipo de Curso</label>
                    <div className="space-y-2">
                      {[
                        { value: "online", label: "🌐 Online" },
                        { value: "presencial", label: "📍 Presencial" },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-3 p-3 border border-input rounded-lg cursor-pointer hover:border-primary"
                        >
                          <input
                            type="radio"
                            name="type"
                            value={option.value}
                            checked={formData.type === option.value}
                            onChange={handleInputChange}
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Preço</label>
                    <div className="space-y-2">
                      {[
                        { value: "free", label: "Gratuito" },
                        { value: "paid", label: "Pago" },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-3 p-3 border border-input rounded-lg cursor-pointer hover:border-primary"
                        >
                          <input
                            type="radio"
                            name="price"
                            value={option.value}
                            checked={formData.price === option.value}
                            onChange={handleInputChange}
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {formData.price === "paid" && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Valor (R$)</label>
                      <input
                        type="number"
                        placeholder="Ex: 199.00"
                        className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                      />
                    </div>
                  )}
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
                      <p className="font-semibold">{formData.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Nível</p>
                      <p className="font-semibold">{formData.level}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo</p>
                      <p className="font-semibold">{formData.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Preço</p>
                      <p className="font-semibold">{formData.price === "free" ? "Gratuito" : "Pago"}</p>
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
    </>
  )
}
