import { getUserSession } from '@/actions/auth'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
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

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Public Routes: Accessible without authentication
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/hospitals',
    '/about',
    '/contact',
    '/track-token',
  ];
  
  const pathname = request.nextUrl.pathname;

  // Public Routes Handling
  if (!user && !publicRoutes.includes(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }


  // Role-Based Redirection
  const session = await getUserSession();
  const role = session?.role;

  if (role === "patient" && !pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  } 
  else if (role === "department_admin" && !pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  } 
  else if (role === "hospital_admin" && !pathname.startsWith("/hospital-admin")) {
    return NextResponse.redirect(new URL('/hospital-admin/dashboard', request.url))
  } 
  else if (role === "super_admin" && !pathname.startsWith("/super-admin")) {
    return NextResponse.redirect(new URL('/super-admin/dashboard', request.url))
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}