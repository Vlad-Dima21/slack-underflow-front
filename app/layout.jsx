import '@styles/globals.css';
import AppBar from '@components/AppBar';

export const metadata = {
  title: 'SlackUnderflow',
  description: 'Best platform for coding problem solving',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
          <div className='main'>
              <div className='gradient'/>
          </div>
        <main className='app'>
          <AppBar />
              {children}
          </main>
      </body>
    </html>
  )
}
