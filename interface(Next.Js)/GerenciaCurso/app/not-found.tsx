"use client"

import { Navbar } from "@/components/navbar"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-8xl mb-6">404</div>
          <h1 className="text-4xl font-bold mb-4">Página não encontrada</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Desculpe, não conseguimos encontrar a página que você está procurando.
          </p>
          <Link href="/courses">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Voltar ao Catálogo</Button>
          </Link>
        </div>
      </main>
    </>
  )
}
