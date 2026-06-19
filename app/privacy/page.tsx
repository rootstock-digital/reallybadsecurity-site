import type { Metadata } from 'next'
import Footer from '../components/Footer'

export const metadata: Metadata = {
  title: { absolute: 'Privacy Policy | CloudCon' },
  description:
    'How CloudCon (CSA West Michigan, INC) collects, uses, shares, and protects your personal information when you visit cloudcon.ai, register for, sponsor, or attend the CloudCon conference.',
  alternates: { canonical: '/privacy' },
}

// Site palette, reused from the existing components/globals.
const c = {
  bg: '#0D1B2A',
  panel: '#142233',
  heading: '#F5F0E8',
  body: '#8BA3B8',
  accent: '#E8621A',
  border: 'rgba(139,163,184,0.12)',
}

const styles = {
  page: {
    background: c.bg,
    flex: 1,
    padding: '80px 24px 100px',
  } as const,
  container: {
    maxWidth: 720,
    margin: '0 auto',
  } as const,
  eyebrow: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    color: c.accent,
    marginBottom: 16,
  } as const,
  h1: {
    fontWeight: 900,
    fontSize: 'clamp(34px, 6vw, 52px)',
    textTransform: 'uppercase',
    lineHeight: 1,
    letterSpacing: '-0.01em',
    color: c.heading,
    margin: '0 0 16px',
  } as const,
  updated: {
    fontSize: 14,
    color: c.body,
    margin: '0 0 40px',
  } as const,
  h2: {
    fontWeight: 800,
    fontSize: 'clamp(20px, 3vw, 26px)',
    color: c.heading,
    lineHeight: 1.2,
    margin: '48px 0 16px',
    paddingTop: 8,
    borderTop: `1px solid ${c.border}`,
  } as const,
  h3: {
    fontWeight: 700,
    fontSize: 17,
    color: c.accent,
    margin: '24px 0 10px',
  } as const,
  p: {
    fontSize: 16.5,
    lineHeight: 1.8,
    color: c.body,
    margin: '0 0 18px',
  } as const,
  ul: {
    fontSize: 16.5,
    lineHeight: 1.8,
    color: c.body,
    margin: '0 0 18px',
    paddingLeft: 22,
  } as const,
  li: {
    marginBottom: 10,
  } as const,
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    margin: '8px 0 24px',
    fontSize: 15.5,
  } as const,
  th: {
    textAlign: 'left',
    padding: '12px 14px',
    color: c.heading,
    fontWeight: 700,
    background: c.panel,
    border: `1px solid ${c.border}`,
    verticalAlign: 'top',
  } as const,
  td: {
    padding: '12px 14px',
    color: c.body,
    lineHeight: 1.6,
    border: `1px solid ${c.border}`,
    verticalAlign: 'top',
  } as const,
  strong: {
    color: c.heading,
    fontWeight: 700,
  } as const,
  link: {
    color: c.accent,
    textDecoration: 'none',
  } as const,
}

const retention = [
  {
    data: 'Financial and registration records tied to payments',
    period: 'Retained for 7 years to meet tax and accounting obligations.',
  },
  {
    data: 'Other registration and contact details',
    period:
      'Up to 36 months after the relevant event, then deleted or anonymized — unless you’ve asked to stay on our mailing list.',
  },
  {
    data: 'Marketing subscribers',
    period:
      'Kept until they unsubscribe; inactive subscribers are removed after 24 months.',
  },
  {
    data: 'Records of badge scans and sponsor data sharing',
    period: 'Up to 12 months after the event.',
  },
  {
    data: 'Event photography and recordings',
    period:
      'May be retained indefinitely for archival and promotional use; you may request removal by contacting us.',
  },
]

export default function PrivacyPage() {
  return (
    <main style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <article style={styles.page}>
        <div style={styles.container}>
          <p style={styles.eyebrow}>CloudCon</p>
          <h1 style={styles.h1}>Privacy Policy</h1>
          <p style={styles.updated}>Last Updated: 06/19/2026</p>

          <p style={styles.p}>
            This Privacy Policy explains how CSA West Michigan, INC (“CloudCon,”
            “we,” “us,” or “our”) collects, uses, shares, and protects your
            personal information when you visit cloudcon.ai, register for,
            sponsor, or attend the CloudCon conference (the “Event”). It works
            alongside our Terms and Conditions — where the two overlap (for
            example, sponsor data sharing and media), they’re meant to say the
            same thing.
          </p>
          <p style={styles.p}>
            We try to keep this readable. If anything here is unclear, contact us
            at the address in Section 14.
          </p>

          <h2 style={styles.h2}>1. Who This Applies To</h2>
          <p style={styles.p}>This policy covers anyone who:</p>
          <ul style={styles.ul}>
            <li style={styles.li}>
              Visits or interacts with the cloudcon.ai website;
            </li>
            <li style={styles.li}>
              Registers for or attends the Event as a participant;
            </li>
            <li style={styles.li}>Registers or exhibits as a sponsor; or</li>
            <li style={styles.li}>
              Otherwise communicates with us about the Event.
            </li>
          </ul>

          <h2 style={styles.h2}>2. Information We Collect</h2>
          <h3 style={styles.h3}>Information you give us directly</h3>
          <ul style={styles.ul}>
            <li style={styles.li}>
              <strong style={styles.strong}>Registration details:</strong> name,
              email address, company/organization, job title, and any other
              fields you complete during registration (required fields are marked
              with an asterisk).
            </li>
            <li style={styles.li}>
              <strong style={styles.strong}>Billing information:</strong> the
              details needed to process your conference fee. Payment card details
              are entered with and processed by our third-party payment
              processor, ExpoPass — we do not collect or store full payment card
              numbers ourselves.
            </li>
            <li style={styles.li}>
              <strong style={styles.strong}>Communications:</strong> information
              you provide when you email us, fill out a form, or contact support.
            </li>
          </ul>
          <h3 style={styles.h3}>
            Information collected automatically on our website
          </h3>
          <ul style={styles.ul}>
            <li style={styles.li}>
              Standard technical data such as IP address, browser and device
              type, pages viewed, and referring site, collected through cookies
              and similar technologies (see Section 5).
            </li>
            <li style={styles.li}>
              Aggregate analytics via Cloudflare Web Analytics / Google
              Analytics.
            </li>
          </ul>
          <h3 style={styles.h3}>Information collected at the Event</h3>
          <ul style={styles.ul}>
            <li style={styles.li}>
              <strong style={styles.strong}>Badge scans:</strong> when you allow a
              sponsor or exhibitor to scan your badge, the contact details encoded
              on it are shared with that sponsor (see Section 4).
            </li>
            <li style={styles.li}>
              <strong style={styles.strong}>Session and attendance data:</strong>{' '}
              which sessions you check into, where applicable.
            </li>
            <li style={styles.li}>
              <strong style={styles.strong}>Photography, video, and audio:</strong>{' '}
              images and recordings captured during the Event, consistent with
              the media release in our Terms and Conditions.
            </li>
          </ul>

          <h2 style={styles.h2}>3. How We Use Your Information</h2>
          <p style={styles.p}>We use your information to:</p>
          <ul style={styles.ul}>
            <li style={styles.li}>
              Process your registration and payment, and provide your conference
              access;
            </li>
            <li style={styles.li}>
              Communicate with you about the Event — confirmations, schedule or
              venue changes, and logistics;
            </li>
            <li style={styles.li}>
              Respond to your questions and provide support;
            </li>
            <li style={styles.li}>
              Operate, secure, and improve the website and the Event;
            </li>
            <li style={styles.li}>
              With your consent, send you marketing or updates about CloudCon and
              future events;
            </li>
            <li style={styles.li}>
              Facilitate sponsor follow-up where you’ve consented (see Section 4);
              and
            </li>
            <li style={styles.li}>
              Comply with legal obligations and enforce our Terms and Conditions.
            </li>
          </ul>

          <h2 style={styles.h2}>4. How We Share Your Information</h2>
          <p style={styles.p}>
            We share personal information only in the following circumstances:
          </p>
          <ul style={styles.ul}>
            <li style={styles.li}>
              <strong style={styles.strong}>Sponsors.</strong> By registering, you
              consent to your contact information being shared with conference
              sponsors for relevant follow-up communications. Scanning your badge
              at a sponsor booth constitutes explicit consent to share your
              information with that specific sponsor. You may opt out of sponsor
              communications at any time (see Section 6). Once your information is
              shared with a sponsor at your request or via a badge scan, that
              sponsor’s use of it is governed by their privacy policy.
            </li>
            <li style={styles.li}>
              <strong style={styles.strong}>Service providers.</strong> We share
              data with vendors who help us run the Event and website — for
              example, our registration platform ExpoPass, payment processor
              ExpoPass, email/communications provider Microsoft and
              hosting/analytics providers. They may only use your information to
              perform services for us.
            </li>
            <li style={styles.li}>
              <strong style={styles.strong}>Legal and safety.</strong> We may
              disclose information where required by law, or to protect the
              rights, property, or safety of CloudCon, attendees, or others.
            </li>
            <li style={styles.li}>
              <strong style={styles.strong}>Business transfers.</strong> If
              CloudCon or its assets are acquired or merged, your information may
              be transferred as part of that transaction.
            </li>
          </ul>
          <p style={styles.p}>We do not sell your personal information.</p>

          <h2 style={styles.h2}>5. Cookies and Tracking Technologies</h2>
          <p style={styles.p}>
            Our website does not use tracking cookies, advertising pixels, or
            cross-site profiling. We don’t serve you a cookie consent banner
            because we don’t set the kind of cookies that would require one. Any
            cookies introduced in the future will be strictly necessary for the
            site to function (for example, keeping you signed in during
            registration), and we’ll update this policy if that changes.
          </p>

          <h2 style={styles.h2}>6. Marketing Communications and Your Choices</h2>
          <ul style={styles.ul}>
            <li style={styles.li}>
              <strong style={styles.strong}>Event and marketing email:</strong>{' '}
              you can unsubscribe at any time using the link in any marketing
              email, or by contacting us.
            </li>
            <li style={styles.li}>
              <strong style={styles.strong}>Sponsor follow-up:</strong> you may
              opt out of sponsor communications at any time by contacting us at
              the address in Section 14. Note that once information has been
              shared with a sponsor (including via a badge scan), you may also
              need to contact that sponsor directly to be removed from their
              lists.
            </li>
          </ul>

          <h2 style={styles.h2}>7. Data Retention</h2>
          <p style={styles.p}>
            We keep personal information only as long as needed for the purposes
            in this policy:
          </p>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th} scope="col">
                  Information
                </th>
                <th style={styles.th} scope="col">
                  Retention period
                </th>
              </tr>
            </thead>
            <tbody>
              {retention.map((row) => (
                <tr key={row.data}>
                  <th style={{ ...styles.td, color: c.heading, fontWeight: 700 }} scope="row">
                    {row.data}
                  </th>
                  <td style={styles.td}>{row.period}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={styles.p}>
            Once these periods lapse, we delete or anonymize the information.
          </p>

          <h2 style={styles.h2}>8. Data Security</h2>
          <p style={styles.p}>
            We take reasonable and appropriate technical and organizational
            measures to protect your information, including encryption in transit,
            access controls, and limiting personal data to the people and vendors
            who need it. No method of transmission or storage is ever completely
            secure, so we can’t guarantee absolute security — but we don’t treat
            security as a checkbox, and we work to keep our practices honest and
            current.
          </p>

          <h2 style={styles.h2}>9. Your Privacy Rights</h2>
          <p style={styles.p}>
            Depending on where you live, you may have the right to:
          </p>
          <ul style={styles.ul}>
            <li style={styles.li}>
              Access the personal information we hold about you;
            </li>
            <li style={styles.li}>
              Request correction of inaccurate information;
            </li>
            <li style={styles.li}>Request deletion of your information;</li>
            <li style={styles.li}>
              Opt out of marketing and sponsor communications;
            </li>
            <li style={styles.li}>
              Request a copy of your information in a portable format; and
            </li>
            <li style={styles.li}>
              Object to or restrict certain processing.
            </li>
          </ul>
          <p style={styles.p}>
            To exercise any of these, contact us at the address in Section 14.
            We’ll respond as required by applicable law.
          </p>

          <h2 style={styles.h2}>10. International Attendees</h2>
          <p style={styles.p}>
            CloudCon is operated from Michigan, USA. If you register or attend
            from another country, your information will be transferred to and
            processed in USA, where data protection laws may differ from those in
            your location. By registering, you understand that your information
            will be handled as described in this policy.
          </p>

          <h2 style={styles.h2}>11. Children’s Privacy</h2>
          <p style={styles.p}>
            The Event and website are intended for professionals and are not
            directed to children under 16. We do not knowingly collect personal
            information from children. If you believe a child has provided us
            information, contact us and we will delete it.
          </p>

          <h2 style={styles.h2}>12. Third-Party Links and Services</h2>
          <p style={styles.p}>
            Our website and communications may link to third-party sites and
            services (sponsors, payment processors, social platforms). We are not
            responsible for their privacy practices — review their policies
            directly.
          </p>

          <h2 style={styles.h2}>13. Changes to This Policy</h2>
          <p style={styles.p}>
            We may update this policy from time to time. When we do, we’ll revise
            the “Last Updated” date above and, where appropriate, provide
            additional notice. Continued use of the website or participation in
            the Event after changes take effect constitutes acceptance of the
            updated policy.
          </p>

          <h2 style={styles.h2}>14. Contact Us</h2>
          <p style={styles.p}>Questions, requests, or opt-outs:</p>
          <p style={styles.p}>
            <strong style={styles.strong}>CSA West Michigan, INC</strong>
            <br />
            Email:{' '}
            <a href="mailto:matt@csawestmichigan.com" style={styles.link}>
              matt@csawestmichigan.com
            </a>
            <br />
            Mailing address: PO Box 828, Grandville, MI 49468
          </p>
        </div>
      </article>
      <Footer />
    </main>
  )
}
