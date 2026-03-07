import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)', 
  '/new-workout(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  // resume link
 const isRecruiter = req.nextUrl.searchParams.get('view') === 'resume1703';

  
  if (isProtectedRoute(req) && !isRecruiter) {
    await auth.protect();
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}