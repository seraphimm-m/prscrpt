export const metadata = {
  title: 'The Index - Prescript Pneumatic Terminal',
  description: 'Execute the Will of the City.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ backgroundColor: '#070b12', margin: 0, padding: 0 }}>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#070b12' }}>
        {children}
      </body>
    </html>
  )
}
