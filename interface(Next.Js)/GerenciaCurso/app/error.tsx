"use client"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-8xl mb-6">⚠️</div>
          <h1 className="text-4xl font-bold mb-4">Algo deu errado</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Desculpe, ocorreu um erro inesperado. Por favor, tente novamente.
          </p>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => reset()}>
              Tentar Novamente
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => (window.location.href = "/")}
            >
              Voltar ao Início
            </Button>
          </div>
        </div>
      </main>
    </>
  )
}
