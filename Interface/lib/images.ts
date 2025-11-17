export type CourseImageResponse = {
  id: number
  url: string
  mimeType: string
  sizeBytes: number
}

const BASE = "/api"

function buildAuthHeaders(token?: string) {
  const headers: Record<string, string> = {}
  if (token) headers["Authorization"] = `Bearer ${token}`
  return headers
}

export async function listCourseImages(courseId: number, token: string): Promise<CourseImageResponse[]> {
  const res = await fetch(`${BASE}/cursos/${courseId}/imagens`, {
    headers: buildAuthHeaders(token),
  })
  if (!res.ok) throw new Error("Falha ao listar imagens")
  return res.json()
}

export async function uploadCourseImages(courseId: number, files: File[], token: string): Promise<CourseImageResponse[]> {
  const form = new FormData()
  files.forEach((f) => form.append("files", f))
  const res = await fetch(`${BASE}/cursos/${courseId}/imagens`, {
    method: "POST",
    headers: buildAuthHeaders(token),
    body: form as any,
  })
  if (!res.ok) {
    let message = "Falha ao enviar imagens"
    try {
      const data = await res.json()
      if (typeof (data as any)?.message === "string") message = (data as any).message
    } catch {}
    throw new Error(message)
  }
  return res.json()
}

export async function deleteCourseImage(courseId: number, imageId: number, token: string): Promise<void> {
  const res = await fetch(`${BASE}/cursos/${courseId}/imagens/${imageId}`, {
    method: "DELETE",
    headers: buildAuthHeaders(token),
  })
  if (!res.ok) {
    let message = "Falha ao remover imagem"
    try {
      const data = await res.json()
      if (typeof (data as any)?.message === "string") message = (data as any).message
    } catch {}
    throw new Error(message)
  }
}