import type { Metadata } from "next";

import EditorialShell from "../components/EditorialShell";

export const metadata: Metadata = {
  title: "Join the Signal",
  description: "Join the Really Bad Security newsletter for useful security observations, serious vulnerabilities, and practical awareness.",
  alternates: { canonical: '/join' },
};

export default function JoinPage() {
  return (
    <EditorialShell>
      <header className="read-page-header">
        <div className="container">
          <span className="eyebrow">Join</span>
          <h1>The Signal</h1>
          <p>Current security observations, threat activity in the wild, serious vulnerabilities, and awareness guidance that might actually make someone pause before clicking.</p>
        </div>
      </header>
      <section className="section join-page-section" aria-labelledby="join-newsletter-heading">
        <div className="container join-page-layout">
          <div className="join-page-intro">
            <span className="label">The RBS newsletter</span>
            <h2 id="join-newsletter-heading">Useful security context. No vendor fog.</h2>
            <p>RBS sends the signals worth noticing, with enough context to help you decide what matters and what can wait.</p>
            <ul>
              <li>Current observations and practical awareness</li>
              <li>Threat activity and vulnerabilities worth understanding</li>
              <li>A clear point of view, minus the security theater</li>
            </ul>
          </div>
          <aside className="join-page-cta" aria-labelledby="join-cta-heading">
            <span className="label">Ready when you are</span>
            <h2 id="join-cta-heading">Get on the list.</h2>
            <p>You’ll complete your signup securely on Beehiiv, where you can manage your subscription at any time.</p>
            <a className="join-page-button" href="https://reallybadsecurity.beehiiv.com/subscribe" target="_blank" rel="noreferrer">Continue to signup <span aria-hidden="true">↗</span></a>
            <p className="join-page-note">No email address is collected on this site.</p>
          </aside>
        </div>
      </section>
    </EditorialShell>
  );
}
