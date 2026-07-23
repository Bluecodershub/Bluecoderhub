import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../config/routes';
import { COMPANY_EMAIL } from '../config/constants';

const REVIEW_NOTICE = 'This notice is written in plain English to describe how Bluecoderhub currently handles data on this site. It is not a substitute for the reviewed legal document that will replace it before commercial launch.';

const privacy = {
    eyebrow: 'Privacy',
    title: 'Privacy Policy',
    intro: 'Bluecoderhub PVT LTD ("Bluecoderhub", "we") operates bluecoderhub.com. This notice explains what we collect on this site, why, and how long we keep it.',
    sections: [
        {
            heading: 'What we collect',
            body: [
                'Email address, when you subscribe to our newsletter or submit a form (contact, waitlist).',
                'Application details — name, email, phone (optional), portfolio URL (optional), and cover letter — when you apply to a role on our Careers page.',
                'Admin authentication cookies for team members with an account. These cookies are httpOnly, SameSite=Strict, and marked Secure in production.',
                'Server request logs — IP address, user-agent, request path and duration — retained for operational debugging and security review.',
            ],
        },
        {
            heading: 'Why we collect it',
            body: [
                'To send you the specific product update, early-access notification, or reply to the inquiry you submitted.',
                'To review and respond to applications for open roles.',
                'To operate the site securely, including rate limiting, abuse prevention, and incident response.',
            ],
        },
        {
            heading: 'What we do not do',
            body: [
                'We do not currently run third-party analytics or advertising trackers on this site.',
                'We do not sell your personal data.',
                'We do not use your email or application data to train external AI models.',
            ],
        },
        {
            heading: 'How long we keep it',
            body: [
                'Newsletter subscribers: until you unsubscribe.',
                'Applications: 24 months after submission, then deleted or anonymized.',
                'Server logs: 30 days.',
                'Admin authentication cookies: 2 hours per session; you can log out at any time.',
            ],
        },
        {
            heading: 'Your choices',
            body: [
                `Ask us for a copy of the data we have on you, correction of that data, or deletion of it — email ${COMPANY_EMAIL}.`,
                'Withdraw consent for the newsletter or waitlist by asking to be removed via the same address.',
                'For applications, you can withdraw before we contact you.',
            ],
        },
        {
            heading: 'Contact',
            body: [
                `Data-protection questions: ${COMPANY_EMAIL}.`,
                'We respond to reasonable requests within 30 days.',
            ],
        },
    ],
};

const terms = {
    eyebrow: 'Terms',
    title: 'Terms of Service',
    intro: 'These terms describe how you may use bluecoderhub.com and any product surfaces we make available on it.',
    sections: [
        {
            heading: 'Acceptable use',
            body: [
                'Use the site lawfully and in good faith. Do not attempt to reverse-engineer, disrupt, or gain unauthorized access to any part of the platform.',
                'Do not use the newsletter, waitlist, or contact forms to distribute unsolicited commercial content or malware.',
                'Applications must be your own work and accurately reflect your experience.',
            ],
        },
        {
            heading: 'Content and intellectual property',
            body: [
                'All research posts, product copy, and visual assets on this site are owned by Bluecoderhub PVT LTD unless attributed otherwise.',
                'You may quote short passages for personal, educational, or journalistic use with attribution and a link back to the original.',
                'You may not republish full posts, use our marks, or claim endorsement without written permission.',
            ],
        },
        {
            heading: 'Product early access',
            body: [
                'Early access to the AI CAD Copilot is offered at our discretion. Product-specific terms apply when you accept an invitation, including confidentiality where relevant.',
                'We may change, limit, or withdraw early access at any time.',
            ],
        },
        {
            heading: 'Disclaimers',
            body: [
                'The site and its content are provided on an "as is" basis. We work to keep information accurate, but do not warrant that every research post reflects the most current state of the field.',
                'Nothing on this site is engineering, legal, financial, or medical advice.',
            ],
        },
        {
            heading: 'Governing law',
            body: [
                'These terms are governed by the laws of India. Disputes will be handled in the courts of Chennai, Tamil Nadu.',
            ],
        },
        {
            heading: 'Changes',
            body: [
                'We may update these terms as the product matures. Material changes will be announced on this page with a revised date.',
            ],
        },
    ],
};

const cookies = {
    eyebrow: 'Cookies',
    title: 'Cookie Policy',
    intro: 'This site uses a small number of cookies. All of them are essential for the functionality below; none are used for advertising or cross-site tracking.',
    sections: [
        {
            heading: 'What we set',
            body: [
                'auth_token — an httpOnly, SameSite=Strict, Secure-in-production cookie that authenticates admin sessions. Expires after 2 hours or when you log out.',
                'No third-party analytics or advertising cookies are set by this site as of the current build.',
            ],
        },
        {
            heading: 'What we do not set',
            body: [
                'No Google Analytics, Meta Pixel, or comparable third-party tracker.',
                'No cross-site tracking cookies.',
                'No cookies for uses other than authentication.',
            ],
        },
        {
            heading: 'Your controls',
            body: [
                'Block or delete cookies through your browser settings. Blocking the auth_token cookie will simply prevent admin login on this device.',
                'If we ever add non-essential cookies, we will require explicit consent through a banner before setting them.',
            ],
        },
    ],
};

const content = {
    '/privacy': privacy,
    '/terms': terms,
    '/cookies': cookies,
};

export default function Legal() {
    const location = useLocation();
    const page = content[location.pathname] || content['/privacy'];

    return (
        <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
            <section className="max-w-3xl mx-auto rounded-2xl border border-white/10 bg-white/[0.045] p-6 sm:p-10">
                <p className="text-sm font-bold uppercase text-blue-200/80 mb-3 tracking-widest">Bluecoderhub — {page.eyebrow}</p>
                <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-normal">{page.title}</h1>
                <p className="mt-6 text-gray-400 leading-relaxed">{page.intro}</p>

                <div className="mt-8 space-y-8">
                    {page.sections.map((section) => (
                        <div key={section.heading}>
                            <h2 className="text-xl font-display font-bold text-white mb-3">{section.heading}</h2>
                            <ul className="space-y-2 text-gray-300 leading-relaxed">
                                {section.body.map((item, index) => (
                                    <li key={index} className="flex gap-3">
                                        <span className="text-blue-300/60 mt-2 shrink-0 w-1 h-1 rounded-full bg-blue-300/60" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-10 rounded-xl border border-blue-300/20 bg-blue-300/5 p-4 text-sm text-blue-100/80">
                    {REVIEW_NOTICE}
                </div>

                <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <p className="text-xs text-gray-500 font-mono">Last updated: 2026-07-23</p>
                    <Link
                        to={ROUTES.CONTACT}
                        className="inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-5 text-sm font-extrabold text-black hover:bg-blue-100 transition-colors"
                    >
                        Contact us
                    </Link>
                </div>
            </section>
        </main>
    );
}
