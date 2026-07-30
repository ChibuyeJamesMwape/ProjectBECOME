# ProjectBECOME mobile app

_Started 2026-07-30 05:13 UTC_

---

## User

Design a mobile app for projectBECOME
You are an expert full-stack developer building a mobile-first web application. This app is the digital ecosystem for an identity-based leadership masterclass. The core thesis is that identity, not just skills, is the infrastructure for sustainable leadership. The target audience is African professionals moving from compliance-driven lives to purpose-anchored leadership. The application must logically track and gate a user's progression through a proprietary 5-stage framework: Exposure, Internalization, Reinforcement, Solidification, and Replication. Acknowledge this architecture and wait for my next instruction."

"Build the database schema and backend logic to track a user's progression through the 5 stages. Set up tables for the following:

User Profile: Must capture baseline identity metrics and current professional constraints, not just name and email.

Exposure Module: A secure video player for masterclass content paired with a text-input audit where users submit their current limiting paradigms.

Internalization Module: A daily journaling database tagged to specific identity shifts.

Reinforcement Module: A habit-tracking schema where users check off daily actions aligned with their new identity.

Solidification Module: A data visualization dashboard calculating the user's consistency streak and milestone completion.

Replication Module: A peer-to-peer sharing node where users can export their journey metrics or generate an invite link for a mentee.
Generate the schema and authentication flow."

"Generate the frontend UI for the onboarding sequence. When a user logs in for the first time, bypass the standard home screen. Instead, push them into an 'Identity Audit' (The Exposure Stage). Present a 3-step form asking them to identify their current structural systems vs. their individual design. Store this data in their profile. Only once submitted, unlock the main dashboard. Use a clean, modern UI with high contrast."

"Update the application's core logic. Remove all manual 'mark as complete' or 'next step' buttons from the user interface. Implement a strict programmatic gating system. Stage 2 (Internalization) must remain locked in the database until the user's Exposure Audit text field registers a string length greater than 300 characters. Stage 3 (Reinforcement) remains locked until the database logs 7 consecutive daily boolean values of 'true' for journaling. Stage 5 (Replication) is only achieved when the user's unique referral hash is registered as a new user's creation token. Build the middleware to enforce these constraints."

## Assistant

I can't stand up a real database or backend here — what I can build is a high-fidelity, fully interactive mobile prototype of projectBECOME: the Identity Audit onboarding, the 5-stage gated journey (Exposure → Replication), journaling, habit tracking, streak dashboard, and the mentee-invite flow — with the gating rules (300+ char audit, 7 consecutive journal days, referral unlock) simulated in real working logic and persisted locally, so it behaves exactly like the spec. It'll follow the attached Organic design system.

A few questions before I build:

_[tool: questions_v2]_

## User

Questions answered:
- scope: Full flow: onboarding audit → all 5 stages, with working gating logic
- start_state: Both, with a demo switcher to jump between states
- gating_feel: Visible with a progress meter toward unlock (e.g. 4/7 journal days)
- audit_form: Structured worksheet: labeled fields, systems vs. design side-by-side
- journal: Both preset + custom
- habits: Preset suggestions + custom
- video: Placeholder player (I'll add real videos later)
- copy: Authoritative mentor: direct, challenging
- branding: uploads/branding-1785389227148.pdf
- extras: Mentor/cohort view for the Replication stage, Notifications/reminders screen, Profile & baseline identity metrics screen
- anything: "The core operating principle of this application is identity-based change, not skill acquisition. Do not use negative hooks or vilify opposing perspectives in any generated copy; focus strictly on genuine, authentic messaging that drives users toward their original design. The architecture must account for an African professional audience, meaning the tone must be uncompromising and the framework must challenge structural conformity. Enforce strict programmatic gating between the 5 stages—users must mathematically prove their work through data input before advancing. Do not include manual 'mark as complete' overrides."

## Assistant

_[tool: read_skill_prompt]_

_[tool: list_files]_

_[tool: read_skill_prompt]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: list_files]_

_[tool: read_file]_

The PDF is 17MB (likely image-heavy, 8 pages). I'll render it in the preview instead.

_[tool: write_file]_

_[tool: show_html]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: multi_screenshot]_

_[tool: get_webview_logs]_

_[tool: sleep]_

_[tool: multi_screenshot]_

_[tool: write_file]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: multi_screenshot]_

Pages are flattened images (no text layer). Rendering key pages at high resolution to read the exact values.

_[tool: write_file]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: multi_screenshot]_

_[tool: multi_screenshot]_

_[tool: sleep]_

_[tool: multi_screenshot]_

_[tool: update_todos]_

_[tool: dc_write]_

_[tool: delete_file]_

_[tool: update_todos]_

_[tool: ready_for_verification]_

_[tool: snip]_

The prototype is out for review. It's built on your uploaded brand book (noir/gold/cream, Playfair Display + Space Mono + Poppins, the five Formation marks) rather than the generic theme, since that's projectBECOME's own identity.

What's in it:
- **Onboarding**: first login bypasses home and forces the 3-step Identity Audit (baseline, system vs. design worksheet side by side, constraints + commitment). Dashboard unlocks only on submit.
- **Strict computed gating, no complete buttons**: Internalization opens at 300+ audit characters, Reinforcement at 7 consecutive journal days, Solidification at 14 fully-checked action days, Replication at 30 consistent days, and is only *achieved* when your code registers a new user. Locked stages show live progress meters.
- **Modules**: video player + paradigm audit, tagged daily journal with streak dots, habit checklist with masterclass presets + custom, streak-ring dashboard with 14-day chart and milestones, and the Circle with your formation code, copyable invite link, JSON metrics export, and mentee list.
- **Demo rig** under the phone: jump between First session, Day 5, Day 21, Day 45, and Replication. State persists between visits.
- Gate thresholds are adjustable in the Tweaks panel if you want to test with shorter windows.

Caveats: the video is a placeholder awaiting your content, and the "mentee claimed your code" event is simulated via the Replication persona since there's no real backend here. Want me to add anything, like a mentee-side view of what an invitee sees?

## User

Fix this design so it publishes cleanly: `ProjectBECOME.dc.html`

## Assistant

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Done. The design had no code-referenced assets or project URLs; the only thing missing was the unpack splash, which I've added (a noir "b." mark with the five gold Formation bars). The design-system warning is expected — this build intentionally follows your uploaded projectBECOME brand book instead of the bound Organic theme.

Click **Publish as artifact** in the Share menu again to re-check the preview.

