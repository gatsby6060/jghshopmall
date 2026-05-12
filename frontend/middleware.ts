import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for:
  // - api routes
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico, sitemap.xml, robots.txt
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
