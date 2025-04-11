// app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server' // Use server client here
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const cookieStore = cookies()
    const supabase = createClient() // Uses cookies() internally
    const { error } = await (await supabase).auth.exchangeCodeForSession(code)
    if (!error) {
      // Redirect to the home page or intended destination after successful login
      return NextResponse.redirect(`${origin}/dashboard`) // Or /dashboard, etc.
    } else {
       console.error("Auth callback error:", error);
    }
  }

  // Redirect to an error page or login page if something went wrong
  console.error("Invalid auth code or other callback error.");
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}