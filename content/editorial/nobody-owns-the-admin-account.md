---
{
  "id": "rbs-security-0001",
  "title": "Nobody Owns the Admin Account",
  "slug": "nobody-owns-the-admin-account",
  "summary": "A practical draft for small teams that need to account for the privileged identities behind identity, billing, domains, data, integrations, and security settings.",
  "status": "in_review",
  "format": "explainer",
  "series": "operational-readiness",
  "authors": [{ "id": "really-bad-security", "name": "Really Bad Security" }],
  "sources": [
    { "title": "NIST SP 800-53 Rev. 5, AC-2 Account Management", "publisher": "National Institute of Standards and Technology", "url": "https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-53r5.pdf" },
    { "title": "FY 2025 FISMA Metrics Evaluation Guide", "publisher": "Cybersecurity and Infrastructure Security Agency", "url": "https://www.cisa.gov/sites/default/files/2025-05/Final%20FY%202025%20IG%20FISMA%20Metrics%20Evaluation%20Guide_05%20May%202025-508.pdf" },
    { "title": "Manage emergency access admin accounts", "publisher": "Microsoft Learn", "url": "https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/security-emergency-access" },
    { "title": "Root user best practices", "publisher": "AWS Identity and Access Management", "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/root-user-best-practices.html" }
  ],
  "disclosures": [],
  "canonical": { "mode": "owner-decision-required" },
  "seo": { "title": "Nobody Owns the Admin Account | Really Bad Security", "description": "Unpublished local editorial draft. Not for indexing or distribution.", "noIndex": true }
}
---

## Nobody Owns the Admin Account

> **Unpublished draft — not for indexing, distribution, or operational use without technical and owner review.** This draft is based on the repository source brief and intentionally does not prescribe product-specific recovery or emergency-access configurations.

The account that can change your domain, reset everyone’s passwords, approve billing, and disable your security settings is not a “setup detail.” It is an operational dependency. If the answer to “who owns it?” is “probably someone,” you do not have an owner. You have a future support ticket with existential energy.

For a small team, this is not a lecture about making every employee pick better passwords. It is about the identities and roles that can change identity, billing, domains, data access, integrations, or security settings—and whether anyone can explain how those accounts are governed.

## This is privileged-account governance, not ordinary account hygiene

NIST’s account-management control describes the work in unglamorous but useful terms: define account types and managers; authorize users and privileges; manage creation, modification, disabling, and removal; monitor accounts; and review them. [NIST SP 800-53 Rev. 5, AC-2](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-53r5.pdf) is a control catalog, not a startup to-do list. The practical translation is still valuable: a privileged account should have a purpose, an accountable owner, an appropriate level of access, and a lifecycle.

The problem is not that every administrator needs a universal “break-glass” pattern. Platforms differ. The problem is that a team may be unable to answer basic questions about the account that can administer a critical system.

## What “nobody owns it” looks like

The pattern is usually less dramatic than a movie montage. It can look like:

- A shared administrator credential that survives a team change without a clear membership or rotation process.
- A founder’s old account still holding the only reliable recovery path.
- A personal recovery email or device acting as an undocumented dependency.
- A broad administrator role that outlives the work that required it.
- A recovery process that exists in conversation but has not been safely tested.
- Privileged activity that is logged where the product supports it, but is not assigned a review path.

These are operating conditions, not proof that an account has been compromised. They do, however, make lockout, lingering access, unclear change authority, and slow response more likely to become expensive problems.

## Why the boring register matters

CISA’s FY 2025 FISMA evaluation guidance covers inventorying and validating privileged accounts, reviewing and adjusting privileges, least privilege, separation of duties, and reviewing privileged-account activity. It is federal evaluation guidance—not a universal legal requirement for a small team—but it is a useful model for what needs deliberate ownership. [CISA, FY 2025 FISMA Metrics Evaluation Guide](https://www.cisa.gov/sites/default/files/2025-05/Final%20FY%202025%20IG%20FISMA%20Metrics%20Evaluation%20Guide_05%20May%202025-508.pdf)

Start with a small register. For each privileged account or role, record:

- The system and account or role.
- The named accountable owner.
- The permitted use and current privilege level.
- A backup owner or vendor-supported recovery process, where the platform supports one.
- Authentication and recovery dependencies.
- The next review date and where relevant activity can be reviewed.

This does not create security by spreadsheet. It creates enough shared understanding to find the real dependency before it becomes an outage.

## A small-team ownership check

Set aside thirty minutes. Pick the five systems that could lock the team out, change billing, control a domain, alter access to important data, or weaken security settings.

- [ ] List the privileged accounts and roles for each system.
- [ ] Name an accountable owner for each one.
- [ ] Record the vendor-supported recovery or backup process where available.
- [ ] Reduce access that is broader than the current job requires; use the product’s roles rather than assuming everyone needs full control.
- [ ] Make departures, role changes, and contractor offboarding trigger a privileged-access review.
- [ ] For shared or group authenticators, document membership and change the authenticator when someone leaves the group, or move to attributable access where feasible. [NIST SP 800-53A Rev. 5, AC-2](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-53Ar5.pdf)
- [ ] Document and protect authentication and recovery dependencies. Do not treat a personal inbox or device as the recovery plan unless that is an approved, documented design.
- [ ] Where the product supports it, ensure privileged actions or sign-ins can be reviewed and decide who reviews exceptional activity.
- [ ] Test the documented recovery or emergency-access process only in a safe, vendor-supported way. Record the result and the next review date.

## Platform examples are patterns, not a recipe

Microsoft Entra documents emergency-access accounts for situations where normal administrator access is unavailable. Its guidance includes secure, monitored, regularly validated emergency accounts, but its exact account count, role design, authentication, exclusions, and testing approach are specific to Entra. [Microsoft Learn: Manage emergency access admin accounts](https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/security-emergency-access)

AWS treats the root user as an exceptional, highly privileged identity and recommends avoiding its use for everyday tasks, protecting sign-in and recovery, and monitoring access. That is an AWS-specific example of why exceptional authority needs distinct handling; it is not a model every SaaS product implements. [AWS IAM: Root user best practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/root-user-best-practices.html)

Google Workspace’s small-business security checklist includes redundant administrator accounts and additional protections. Use the current guidance for the product and organization you actually run; do not copy settings from a different identity provider because the nouns look familiar. [Google Workspace Admin Help: Security checklists](https://support.google.com/a/answer/9184226?hl=en-na)

## Scope the exceptions before they scope you

Some systems need service, group, or emergency identities. Some teams do not have enough people to assign a backup administrator in the way a larger organization would. Those are reasons to document an exception, not reasons to rely on vibes.

Use current vendor guidance for the system in question. If single sign-on or federation is involved, map the dependency before changing an access policy. For regulated or high-impact systems, involve the appropriate security, compliance, legal, or qualified-administrator function before changing recovery, role, or logging settings.

If privileged activity looks suspicious, an account may be taken over, or recovery is already impaired, this is no longer a checklist exercise. Use the organization’s incident-response process and the affected vendor’s support or security guidance.

## The useful conclusion

Administration is a lifecycle, not a setup checkbox. The useful first step is not a heroic migration. It is knowing which identities can materially change the business, who is accountable for them, and how the team will recover without quietly weakening the controls it depends on.

## Sources

- [NIST SP 800-53 Rev. 5, AC-2 Account Management](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-53r5.pdf)
- [NIST SP 800-53A Rev. 5 assessment procedures, AC-2](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-53Ar5.pdf)
- [CISA FY 2025 FISMA Metrics Evaluation Guide](https://www.cisa.gov/sites/default/files/2025-05/Final%20FY%202025%20IG%20FISMA%20Metrics%20Evaluation%20Guide_05%20May%202025-508.pdf)
- [Microsoft Entra: Manage emergency access admin accounts](https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/security-emergency-access)
- [AWS IAM: Root user best practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/root-user-best-practices.html)
- [Google Workspace Admin: Security checklists](https://support.google.com/a/answer/9184226?hl=en-na)

## Social companion draft

> Quick founder test: for the five systems that could lock you out or change billing, can you name the account owner, recovery path, and last review date? If not, the account is not owned. It is just currently logged in somewhere.

**Status:** draft only. No merchandise or Goods promotion is proposed for this article.
