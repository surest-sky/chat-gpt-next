import './globals.css'
import 'tailwindcss/tailwind.css'
import "@arco-design/web-react/dist/css/arco.css";

export const metadata = {
  title: 'ChatGpt 初体验',
  description: 'ChatGpt 初体验',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
