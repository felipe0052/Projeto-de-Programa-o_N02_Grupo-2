"use client"

import { useEffect } from "react"
import { Navbar } from "@/components/navbar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function Home() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) router.replace("/courses")
  }, [isAuthenticated, router])

  return (
    <>
      <Navbar />
      <main>
        <section className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex items-center">
          <div className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6 text-balance">
                Aprenda Novas Habilidades, Transforme Sua Carreira
              </h1>
              <p className="text-xl text-muted-foreground mb-8 text-pretty">
                Acesse milhares de cursos de especialistas renomados e acelere seu desenvolvimento profissional.
              </p>
              <div className="flex gap-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Começar Agora
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button size="lg" variant="outline">
                    Ver Cursos
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-full h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                <span className="text-6xl">📚</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-card">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Por que escolher EduFlow?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: "✨", title: "Cursos de Qualidade", desc: "Conteúdo criado por especialistas da indústria" },
                { icon: "🎯", title: "Aprendizado Prático", desc: "Projetos reais e exercícios práticos" },
                { icon: "📱", title: "Acesso Total", desc: "Estude quando e onde quiser" },
              ].map((item, i) => (
                <div key={i} className="p-6 border border-border rounded-lg hover:border-primary transition">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
