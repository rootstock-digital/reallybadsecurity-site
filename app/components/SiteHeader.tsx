'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Home' },
  { href: '/security-signals', label: 'Read' },
  { href: '/watch', label: 'Watch' },
  { href: '/shop', label: 'Merch' },
  { href: '/join', label: 'Join' },
  { href: '/about', label: 'About' },
]

export default function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="wordmark" href="/" aria-label="Really Bad Security home" aria-current={pathname === '/' ? 'page' : undefined}>
          <Image className="wordmark-mark" src="/rbs-shield-only-logo.png" alt="" width={44} height={44} />
          <span className="wordmark-text">Really Bad <b>Security</b><small>Articles, Podcasts, Merch</small></span>
        </Link>
        <nav className="site-nav" aria-label="Primary navigation">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href === '/security-signals' && pathname.startsWith('/security-signals/'))
            return <Link key={link.href} href={link.href} aria-current={isActive ? 'page' : undefined}>{link.label}</Link>
          })}
        </nav>
      </div>
    </header>
  )
}
