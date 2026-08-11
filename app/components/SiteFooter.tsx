import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <strong className="footer-brand">Really Bad Security</strong>
          <p>Security signals and information for people who prefer clear thinking, fewer buzzwords, and the occasional useful joke.</p>
          <p>I will not always be right, but everything posted here is meant to offer concrete ideas that help make your cybersecurity posture less Really Bad. Disagree? I would genuinely like to hear your take.</p>
        </div>
        <div>
          <span className="eyebrow">Explore</span>
          <p><Link href="/security-signals">Articles</Link></p>
          <p><Link href="/watch">Podcasts</Link></p>
        </div>
        <div>
          <span className="eyebrow">RBS</span>
          <p><Link href="/about">About</Link></p>
          <p><Link href="/editorial-standards">Editorial standards</Link></p>
          <p><Link href="/contact">Contact us</Link></p>
          <p><Link href="/join">Join the community</Link></p>
          <p><Link href="/shop">Shop RBS Merch →</Link></p>
        </div>
      </div>
      <div className="container footer-legal">
        <p>Views and opinions expressed here are my own and do not represent those of any employer, client, sponsor, or partner.</p>
        <p>© 2026 Really Bad Security. All rights reserved.</p>
        <p>Site developed by Rootstock Digital.</p>
      </div>
    </footer>
  )
}
