---
{
  "id": "rbs-security-0004",
  "title": "Assume Your Credentials Are Already Compromised",
  "slug": "assume-credentials-are-compromised",
  "summary": "Treat credential exposure as an operating condition, not a post-breach surprise—and make it much harder for a stolen password to become access.",
  "status": "draft",
  "format": "explainer",
  "series": "operational-readiness",
  "authors": [{ "id": "really-bad-security", "name": "Really Bad Security" }],
  "image": {
    "src": "/media/security-signals/article-cover-template.png",
    "alt": "Notebook-paper editorial cover for Assume Your Credentials Are Already Compromised.",
    "decorative": false
  },
  "sources": [
    { "title": "More than a Password", "url": "https://www.cisa.gov/more-password", "publisher": "CISA" },
    { "title": "Digital Identity Guidelines: Authentication and Authenticator Management (SP 800-63B-4)", "url": "https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-63b-4.pdf", "publisher": "NIST" },
    { "title": "Create a compromised identity incident response SOP template", "url": "https://learn.microsoft.com/en-us/defender-xdr/sop-documentation-template", "publisher": "Microsoft Learn" }
  ],
  "disclosures": [],
  "canonical": { "mode": "local" },
  "seo": {
    "title": "Assume Your Credentials Are Already Compromised | Really Bad Security",
    "description": "Practical ways to limit the damage from exposed credentials before they turn into access.",
    "noIndex": true
  }
}
---

## The assumption is not the incident

"Assume compromise" does not mean declaring that your organization has been breached. It means accepting a more useful possibility: a password, session token, recovery method, or service credential may already be exposed somewhere you cannot see.

Credentials get reused. Phishing pages collect them. Old accounts linger. Passwords turn up in breach collections. People approve the wrong prompt on the wrong day. The question is not whether every credential is compromised. The question is whether a single compromised credential can still become meaningful access.

That is a design and operating problem—not a reason to panic.

## Start with the accounts that can make a bad day worse

Do not begin with a company-wide password-reset ritual. Begin by finding the identities whose compromise would change the day fastest:

- Email administrators and anyone who can create forwarding rules or reset other accounts
- Cloud, infrastructure, and identity administrators
- Remote-access users and VPN administrators
- Finance, payroll, HR, and customer-data roles
- Service accounts, API keys, shared mailboxes, and emergency access accounts

For each one, name an owner and answer four questions: what can this identity reach, how does it authenticate, what logs exist for it, and who can disable or recover it after hours? If those answers live only in somebody's memory, you have already found work to do.

## Make a password less valuable

Passwords are not phishing-resistant. NIST recommends blocking commonly used, expected, or compromised passwords, but a better outcome is to make a captured password insufficient on its own.

Require multi-factor authentication everywhere it is supported, starting with email, remote access, administrators, and high-impact business systems. Prefer phishing-resistant methods such as FIDO/WebAuthn where your identity provider and applications support them. If that migration will take time, improve the interim control: number matching is stronger than an approval-only push, and exceptions should be visible, owned, and time-limited.

This is not a blanket instruction to turn on a feature and declare victory. Test enrollment, recovery, loss of a device, help-desk workflows, contractor access, and emergency accounts. A control that blocks an attacker but locks out the person responsible for restoring service is not operationally ready.

## Reduce the blast radius before you need to investigate it

A compromised user account should not automatically become a compromised environment. Use separate administrative accounts, give people only the access their work requires, and remove accounts and privileges that no longer have a reason to exist. Review standing access to sensitive systems on a schedule that has an owner and a decision-maker.

Session controls matter here too. A password reset is not always enough if an attacker has an active session or refresh token. Know how to revoke sessions, invalidate tokens, reset authentication methods, and rotate non-human secrets in the systems that matter most. Test those actions on a non-production account before the first real incident asks you to learn them live.

## Watch the identity signals attackers leave behind

You do not need a movie-trailer security operations center to notice the basics. Make sure your identity and email logs can answer who signed in, from what device or location, to which application, and with what authentication result. Alert on the signals that deserve a human look:

- Unusual or risky successful sign-ins
- Repeated MFA prompts, denials, or unexpected method changes
- New inbox forwarding rules, delegated access, or suspicious mail rules
- New OAuth consent, application permissions, or service credentials
- Privilege, group-membership, and recovery-method changes

When a signal appears, contact the person through a known channel—not the potentially compromised mailbox—and ask whether they recognize the sign-in, device, application, and prompt. Preserve the evidence before changing it. Then follow a documented path to revoke sessions, reset or rotate the right credential, remove persistence, and look for related access.

## Write the first 30 minutes down

The best time to decide who can disable an executive's account, rotate a service credential, or revoke a session is not during an executive account compromise. Write a small identity-compromise runbook that names the first responder, the identity owner, the escalation path, the evidence to preserve, and the actions that require business approval.

Run it once. Find out whether the person on call can actually see the sign-in logs, whether the emergency account is usable, and whether revoking a session does what you think it does. Update the runbook after every test and every real event.

## Start this week

If this feels like a lot, do not build a cathedral. Start with a short list:

1. Identify the ten accounts whose compromise would create the most damage.
2. Confirm strong MFA and a usable recovery path for each one.
3. Remove one unnecessary privileged account, stale credential, or unowned exception.
4. Verify that sign-in, MFA, and privilege-change logs are retained and reachable.
5. Test the exact steps to revoke a session and regain control of one account.

Assuming credential compromise is not pessimism. It is refusing to make a stolen secret the same thing as a successful attack.

## Scope and limitations

This is a practical planning lens, not an incident declaration or a substitute for your organization's legal, regulatory, identity-platform, or incident-response requirements. Changes to authentication, sessions, privileges, and service credentials can disrupt critical work; test them and use your established approval paths.
