import { redirect } from 'next/navigation';

export default function RootPage() {
  // Middleware handles locale redirection, this is a fallback
  redirect('/ko');
}

