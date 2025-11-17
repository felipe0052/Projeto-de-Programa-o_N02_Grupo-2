export type LoginResponse = {
  id: number
  nome: string
  admin: boolean
  roles: string[]
  jwt: string
}

export type CategoryResponse = {
  id: number
  nome: string
  descricao: string
}

export type CourseResponse = {
  id: number
  nome: string
  descricao: string
  limiteAlunos: number
  valor: number
  creditos: number
  horario: string | null
  categoryId: number
  categoryNome: string | null
  instructorId: number | null
  instructor?: { id: number; nome: string; email: string } | null
  status: string | null
  inscritosAtivos: number | null
  vagasDisponiveis: number | null
  prerequisiteIds: number[] | null
  imagens?: CourseImageResponse[] | null
}

export type CourseCreateRequest = {
  nome: string
  descricao?: string | null
  limiteAlunos: number
  valor: number
  creditos: number
  horario?: string | null
  categoryId: number
  instructorId?: number | null
  status?: string | null
  prerequisiteIds?: number[] | null
}

export type CourseImageResponse = {
  id: number
  url: string
  mimeType: string
  sizeBytes: number
}

export type CategoryCreateRequest = {
  nome: string
  descricao?: string | null
}

const BASE = "/api"

class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function handleJson<T>(res: Response, fallbackMessage: string): Promise<T> {
  if (res.ok) return res.json() as Promise<T>
  let message = fallbackMessage
  try {
    const data = await res.json()
    if (typeof data?.message === "string" && data.message.length > 0) {
      message = data.message
    }
  } catch {}
  throw new ApiError(res.status, message)
}

function buildHeaders(token?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (token) headers["Authorization"] = `Bearer ${token}`
  return headers
}

export async function login(email: string, senha: string): Promise<LoginResponse> {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({ email, senha }),
  })
  return handleJson<LoginResponse>(res, "Login failed")
}

export async function signup(nome: string, email: string, roleCode: "ALUNO" | "INSTRUTOR"): Promise<LoginResponse> {
  const res = await fetch(`${BASE}/auth/signup`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({ nome, email, roleCode }),
  })
  return handleJson<LoginResponse>(res, "Signup failed")
}

export async function getCategories(token?: string): Promise<CategoryResponse[]> {
  const res = await fetch(`${BASE}/categorias`, { headers: buildHeaders(token) })
  return handleJson<CategoryResponse[]>(res, "Falha ao carregar categorias")
}

type CourseListParams = {
  categoria?: number
  instrutor?: number
  maisRecente?: boolean
  maisAntigos?: boolean
  disponibilidade?: boolean
  id?: number
  inscritoPor?: number
}

export async function getCourses(params: CourseListParams = {}, token?: string): Promise<CourseResponse[]> {
  const query = new URLSearchParams()
  if (params.id !== undefined) query.set("id", String(params.id))
  if (params.categoria !== undefined) query.set("categoria", String(params.categoria))
  if (params.disponibilidade !== undefined) query.set("disponibilidade", String(params.disponibilidade))
  if (params.instrutor !== undefined) query.set("instrutor", String(params.instrutor))
  if (params.inscritoPor !== undefined) query.set("inscritoPor", String(params.inscritoPor))
  if (params.maisRecente !== undefined) query.set("maisRecente", String(params.maisRecente))
  if (params.maisAntigos !== undefined) query.set("maisAntigos", String(params.maisAntigos))
  const res = await fetch(`${BASE}/cursos${query.toString() ? `?${query.toString()}` : ""}`, {
    headers: buildHeaders(token),
  })
  return handleJson<CourseResponse[]>(res, "Falha ao carregar cursos")
}

export async function getCourse(id: number, token?: string): Promise<CourseResponse> {
  const res = await fetch(`${BASE}/cursos/${id}`, { headers: buildHeaders(token) })
  return handleJson<CourseResponse>(res, "Falha ao carregar curso")
}

export async function enrollCourse(id: number, userId: number, token: string): Promise<void> {
  const res = await fetch(`${BASE}/cursos/${id}/inscricoes`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify({ userId }),
  })
  if (!res.ok) {
    await handleJson(res, "Falha ao inscrever")
  }
}

export async function updateCourse(id: number, payload: CourseCreateRequest, token: string): Promise<CourseResponse> {
  const res = await fetch(`${BASE}/cursos/${id}`, {
    method: "PUT",
    headers: buildHeaders(token),
    body: JSON.stringify(payload),
  })
  return handleJson<CourseResponse>(res, "Falha ao atualizar curso")
}

export async function createCourse(payload: CourseCreateRequest, token: string): Promise<CourseResponse> {
  const res = await fetch(`${BASE}/cursos`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(payload),
  })
  return handleJson<CourseResponse>(res, "Falha ao criar curso")
}

export async function deleteCourse(id: number, token: string): Promise<void> {
  const res = await fetch(`${BASE}/cursos/${id}`, {
    method: "DELETE",
    headers: buildHeaders(token),
  })
  if (!res.ok) {
    await handleJson(res, "Falha ao deletar curso")
  }
}


export async function createCategory(payload: CategoryCreateRequest, token: string): Promise<CategoryResponse> {
  const res = await fetch(`${BASE}/categorias`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(payload),
  })
  return handleJson<CategoryResponse>(res, "Falha ao criar categoria")
}