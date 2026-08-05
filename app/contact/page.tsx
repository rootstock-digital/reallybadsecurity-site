import type { Metadata } from 'next'

import EditorialShell from '../components/EditorialShell'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Really Bad Security.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <EditorialShell>
      <header className="read-page-header">
        <div className="container">
          <span className="eyebrow">RBS</span>
          <h1>Contact Us</h1>
          <p>Questions, corrections, ideas, and useful leads are welcome.</p>
        </div>
      </header>

      <section className="article" aria-labelledby="contact-heading">
        <div className="container reading-width article-body">
          <h2 id="contact-heading">Get in touch</h2>
          <p>Email <a href="mailto:inquiry@reallybadsecurity.com">inquiry@reallybadsecurity.com</a>. For a correction, please include the relevant page or article link and a short description of the issue.</p>
        </div>
      </section>
    </EditorialShell>
  )
}
