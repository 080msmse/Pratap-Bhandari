import 'next-auth'
import { MemberRole } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      companyId: string
      companyName: string
      role: string
    }
  }

  interface User {
    id: string
    companyId: string | null
    companyName: string | null
    role: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    companyId: string
    companyName: string
    role: string
  }
}
