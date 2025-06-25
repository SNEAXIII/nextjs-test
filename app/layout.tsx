import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import SideNavBar from '@/app/ui/left-nav-bar/sidenav';
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          <div className='flex h-screen flex-col md:flex-row md:overflow-hidden'>
            <div className='w-full flex-none md:w-64'>
              <SideNavBar />
            </div>
            <div className='grow p-6 md:overflow-y-auto md:p-12'>{children}</div>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
