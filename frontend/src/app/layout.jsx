import '@/app/styles/globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black-50">{children}</body>
    </html>
  )
}
