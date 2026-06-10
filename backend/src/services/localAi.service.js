const skillCatalog = [
  { key: 'react', label: 'React Development', track: 'Frontend Engineering', level: 'intermediate' },
  { key: 'javascript', label: 'Modern JavaScript', track: 'Frontend Engineering', level: 'beginner' },
  { key: 'node', label: 'Node.js APIs', track: 'Backend Engineering', level: 'intermediate' },
  { key: 'express', label: 'Express API Security', track: 'Backend Engineering', level: 'intermediate' },
  { key: 'postgres', label: 'PostgreSQL Data Design', track: 'Data Engineering', level: 'intermediate' },
  { key: 'python', label: 'Python Automation', track: 'AI & Data', level: 'beginner' },
  { key: 'data', label: 'Data Science Foundations', track: 'AI & Data', level: 'beginner' },
  { key: 'devops', label: 'DevOps Professional', track: 'Cloud Engineering', level: 'advanced' },
  { key: 'docker', label: 'Docker Deployment', track: 'Cloud Engineering', level: 'intermediate' },
  { key: 'security', label: 'Secure Software Delivery', track: 'Security Engineering', level: 'advanced' }
];

const roleSignals = {
  frontend: ['react', 'javascript', 'css', 'ui', 'frontend', 'accessibility'],
  backend: ['node', 'express', 'api', 'postgres', 'database', 'backend'],
  ai: ['python', 'data', 'model', 'analytics', 'automation', 'ml'],
  cloud: ['devops', 'docker', 'aws', 'deployment', 'ci', 'infrastructure'],
  security: ['security', 'auth', 'jwt', 'privacy', 'compliance']
};

function normalize(value) {
  return String(value || '').toLowerCase();
}

function tokenize(value) {
  return normalize(value).match(/[a-z0-9+#.-]+/g) || [];
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function scoreText(text, signals) {
  const haystack = normalize(text);
  return signals.reduce((score, signal) => score + (haystack.includes(signal) ? 1 : 0), 0);
}

export function recommendLearningPath(profile = {}) {
  const goal = normalize(profile.goal);
  const experience = normalize(profile.experience || 'beginner');
  const interests = Array.isArray(profile.interests) ? profile.interests.map(normalize) : tokenize(profile.interests);
  const combined = [goal, experience, ...interests].join(' ');

  const scored = skillCatalog
    .map((skill) => {
      const interestScore = scoreText(combined, [skill.key, skill.label.toLowerCase(), skill.track.toLowerCase()]);
      const levelScore = skill.level === experience ? 2 : skill.level === 'beginner' ? 1 : 0;
      return { ...skill, score: interestScore * 3 + levelScore };
    })
    .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label));

  const selected = scored.slice(0, 4);
  const fallback = selected.every((item) => item.score === 0)
    ? skillCatalog.slice(0, 4)
    : selected;

  return {
    model: 'bluelearner-path-ranker-v1',
    track: fallback[0]?.track || 'Software Engineering',
    confidence: Math.min(0.95, 0.55 + fallback.reduce((sum, item) => sum + item.score, 0) / 30),
    modules: fallback.map((item, index) => ({
      order: index + 1,
      title: item.label,
      track: item.track,
      level: item.level,
      reason: item.score > 0 ? 'Matched to your goals and interests.' : 'Recommended as a strong platform foundation.'
    })),
    nextAction: 'Start with the first module, then unlock the next recommendation after a progress checkpoint.'
  };
}

export function analyzeCareerFit(application = {}) {
  const position = normalize(application.position);
  const coverLetter = normalize(application.coverLetter || application.cover_letter);
  const portfolioUrl = normalize(application.portfolioUrl || application.portfolio_url);
  const combined = `${position} ${coverLetter} ${portfolioUrl}`;

  const scores = Object.entries(roleSignals).map(([role, signals]) => ({
    role,
    score: scoreText(combined, signals)
  })).sort((a, b) => b.score - a.score);

  const strengths = unique([
    scores[0]?.score > 0 ? `Strong ${scores[0].role} alignment` : '',
    coverLetter.length > 350 ? 'Detailed motivation' : '',
    portfolioUrl ? 'Portfolio included' : '',
    coverLetter.includes('team') || coverLetter.includes('collabor') ? 'Collaboration signal' : '',
    coverLetter.includes('learn') || coverLetter.includes('growth') ? 'Growth mindset signal' : ''
  ]);

  const risks = unique([
    coverLetter.length < 120 ? 'Cover letter is brief' : '',
    !portfolioUrl ? 'No portfolio URL provided' : '',
    scores[0]?.score === 0 ? 'Limited role-specific keywords' : ''
  ]);

  return {
    model: 'career-fit-scorer-v1',
    fitScore: Math.min(100, 45 + (scores[0]?.score || 0) * 10 + strengths.length * 6 - risks.length * 4),
    primaryTrack: scores[0]?.role || 'general',
    strengths,
    risks,
    recommendation: risks.length > strengths.length ? 'review_manually' : 'shortlist_for_review'
  };
}

export function summarizeApplication(application = {}) {
  const fit = analyzeCareerFit(application);
  const coverLetter = String(application.coverLetter || application.cover_letter || '').trim();
  const summary = coverLetter
    ? coverLetter.split(/[.!?]\s+/).filter(Boolean).slice(0, 2).join('. ')
    : 'No cover letter text was provided.';

  return {
    model: 'application-summarizer-v1',
    candidate: application.name || 'Candidate',
    position: application.position || 'Unspecified role',
    summary,
    fit
  };
}

export function generateBlogDraft(input = {}) {
  const topic = String(input.topic || '').trim();
  const audience = String(input.audience || 'technical leaders').trim();
  const tone = String(input.tone || 'practical').trim();
  const safeTopic = topic || 'Building reliable digital products';

  return {
    model: 'blog-planner-v1',
    title: safeTopic,
    slug: safeTopic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80),
    excerpt: `A ${tone} guide for ${audience} on ${safeTopic.toLowerCase()}.`,
    outline: [
      `Why ${safeTopic} matters now`,
      'Core principles and tradeoffs',
      'Implementation roadmap',
      'Operational risks to monitor',
      'How Bluecoderhub approaches delivery'
    ],
    draft: `## Why it matters\n${safeTopic} is most valuable when it connects business goals with measurable engineering outcomes.\n\n## Practical approach\nStart with clear constraints, validate the highest-risk assumptions early, and keep the system observable from day one.\n\n## Delivery checklist\nDefine success metrics, assign ownership, review security boundaries, and measure user impact after launch.`
  };
}

export function answerSupportQuestion(input = {}) {
  const question = normalize(input.question);
  const responses = [
    { signals: ['career', 'job', 'hiring', 'apply'], answer: 'You can apply through the Careers page. The platform stores applications on the server for admin review.' },
    { signals: ['bluelearner', 'learning', 'course'], answer: 'Bluelearnerhub focuses on structured learning paths, gamified progress, coding challenges, and certificates.' },
    { signals: ['finance', 'financehub'], answer: 'FinanceHub is listed as an internal prototype with an early-access waitlist.' },
    { signals: ['contact', 'project', 'service'], answer: 'For project inquiries, use the contact flow or reach Bluecoderhub through the published company email.' }
  ];
  const match = responses.find((item) => item.signals.some((signal) => question.includes(signal)));
  return {
    model: 'support-router-v1',
    answer: match?.answer || 'I can help with products, careers, learning paths, and project inquiries. Please share a little more context.',
    confidence: match ? 0.82 : 0.45
  };
}
