export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout is intentionally minimal.
  // The [locale] segment handles the actual HTML structure.
  return children;
}
