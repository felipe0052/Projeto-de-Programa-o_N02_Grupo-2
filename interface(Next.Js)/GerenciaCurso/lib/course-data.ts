export interface Course {
  id: string
  title: string
  description: string
  category: string
  level: "beginner" | "intermediate" | "advanced"
  type: "online" | "presencial"
  price: number | "free"
  instructor: {
    id: string
    name: string
    bio: string
    avatar: string
  }
  rating: number
  students: number
  image: string
  modules: Module[]
}

export interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  title: string
  duration: number
  content: string
  videoUrl?: string
}

export const mockCourses: Course[] = [
  {
    id: "1",
    title: "React.js Avançado",
    description: "Domine React com hooks, context API e performance optimization",
    category: "Desenvolvimento Web",
    level: "advanced",
    type: "online",
    price: 199,
    instructor: {
      id: "inst1",
      name: "Carlos Santos",
      bio: "Desenvolvedor Full-Stack com 10 anos de experiência",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos",
    },
    rating: 4.8,
    students: 1250,
    image: "/react-curso-avan-ado.jpg",
    modules: [
      {
        id: "m1",
        title: "Fundamentos de React",
        lessons: [
          { id: "l1", title: "Introdução", duration: 15, content: "Intro ao React" },
          { id: "l2", title: "Componentes", duration: 45, content: "Comp content" },
        ],
      },
      {
        id: "m2",
        title: "Hooks e State Management",
        lessons: [{ id: "l3", title: "useState", duration: 30, content: "useState content" }],
      },
    ],
  },
  {
    id: "2",
    title: "Python para Data Science",
    description: "Aprenda Python com pandas, numpy e machine learning",
    category: "Data Science",
    level: "intermediate",
    type: "online",
    price: 249,
    instructor: {
      id: "inst2",
      name: "Mariana Costa",
      bio: "Data Scientist e especialista em Machine Learning",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mariana",
    },
    rating: 4.9,
    students: 2100,
    image: "/python-data-science.png",
    modules: [
      {
        id: "m1",
        title: "Fundamentos Python",
        lessons: [{ id: "l1", title: "Bases de Python", duration: 60, content: "Intro" }],
      },
    ],
  },
  {
    id: "3",
    title: "Design UI/UX Completo",
    description: "Do zero ao profissional em design de interfaces",
    category: "Design",
    level: "beginner",
    type: "online",
    price: "free",
    instructor: {
      id: "inst3",
      name: "Ana Paula",
      bio: "Designer com prêmios internacionais",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ana",
    },
    rating: 4.7,
    students: 5430,
    image: "/design-ui-ux.jpg",
    modules: [
      {
        id: "m1",
        title: "Princípios de Design",
        lessons: [{ id: "l1", title: "Cores e Tipografia", duration: 40, content: "Design basics" }],
      },
    ],
  },
  {
    id: "4",
    title: "Node.js e APIs REST",
    description: "Crie APIs robustas com Node.js e Express",
    category: "Desenvolvimento Web",
    level: "intermediate",
    type: "online",
    price: 179,
    instructor: {
      id: "inst4",
      name: "Lucas Oliveira",
      bio: "Arquiteto de Software especializado em Backend",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lucas",
    },
    rating: 4.6,
    students: 890,
    image: "/nodejs-rest-api.png",
    modules: [
      {
        id: "m1",
        title: "Introdução ao Node.js",
        lessons: [{ id: "l1", title: "Setup e Conceitos", duration: 45, content: "Node intro" }],
      },
    ],
  },
]

export const courseCategories = ["Desenvolvimento Web", "Data Science", "Design", "Mobile", "DevOps", "Segurança"]
