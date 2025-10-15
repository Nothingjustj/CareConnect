import { getUserSession } from '@/actions/auth'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // ====== Use environment variables ======
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, // Server-side env variable
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // Server-side env variable
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)

          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Continue with existing code…
  return supabaseResponse
}
