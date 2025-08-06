export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  role?: string;
  problem?: string;
  approach?: string;
  methods?: string;
  deliverables?: string;
  outcomes?: string;
  image: string;
  imageAlt: string;
  externalLink?: string;
  externalLinkText?: string;
  content?: string;
}

export const projects: Project[] = [
  {
    id: 'sensor',
    title: 'Understanding user perceptions of ambient sensing tech',
    role: 'End-to-end research: study design, recruiting, conducting interviews, analyzing data, synthesizing data, storytelling, presentation',
    problem: 'Google is adopting a sensing technology across their hardware portfolio. Several Google product teams approached our research team to understand the value this tech can enable and their users\' perceptions of its ambient sensing capabilities.',
    approach: 'Teams had hunches around experiences their users would find valuable. In addition to testing their hunches, I reframed the challenge to also understand broader opportunities in each of their product areas.',
    methods: '2-stage research: Unmoderated homework to illuminate current experiences and evaluate concepts, 1:1 in-depth interviews with a subset of participants to dive deeper into perceptions',
    deliverables: 'High-level strategy for near-term experience development\n\nLong-term design strategy for each product team (including emerging target markets, opportunity zones, product / experience recommendations)\n\nParticipant perceptions of privacy and ambient sensing\n\nFeedback on concepts',
    outcomes: 'Influence key decisions: Prioritize experiences enabled by sensing tech, Which devices to include the sensing tech, Roadmaps for each product team.\n\nNew partnerships with cross-functional teams for future research.\n\nSupport from VP leadership on ambient sensing initiatives.',
    image: '/am_goog.jpeg',
    imageAlt: 'Google ambient sensing research project',
    content: 'This was a 6-month solo project I did at Google from 2020-2021.'
  },
  {
    id: 'nudge',
    title: 'Nudging customers toward healthy financial behaviors',
    problem: 'A national wireless company loses $40m / year because many of its customers are late on their bills.',
    methods: 'Ethnographic interviews (w/ customers & client retail employees)\n\nSacrificial concepting\n\nCustomer archetypes\n\nBehavioral targeting (in collaboration w/ quant team)',
    deliverables: 'We designed 3 "nudges" to test via our client\'s service channels, targeted at late payer archetypes our client could help the most.',
    outcomes: 'We launched the 3 "nudge-experiments".\n\nBuilt empathy w/in client team for late payers',
    image: '/nu_inhome.png',
    imageAlt: 'Research participant in their home during ethnographic interview',
    externalLink: 'https://www.dropbox.com/s/l6p7sezsbapy74r/2%20-%20Late%20Payers.pdf?dl=0',
    externalLinkText: 'Check out details in the pdf.',
    content: 'A research participant shares their experiences and strategies for building healthy financial behaviors.'
  },
  {
    id: 'ev',
    title: 'Finding product-market fit for a new e-vehicle',
    problem: 'Client is building a 2-sided marketplace platform, but doesn\'t know what will get each community to engage.',
    methods: 'Ethnographic interviews\n\nSacrificial concepts\n\nCompetitive analysis\n\nLiterature review',
    deliverables: 'An insights-based engagement strategy for each community.',
    outcomes: 'This project is still underway.\n\nWe\'ve completed a research phase on one side of the market and are currently conducting research with the other side.',
    image: '/ev_car-1.png',
    imageAlt: 'Electric vehicle research participant',
    externalLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    externalLinkText: 'Detailed Portfolio piece coming soon :)',
    content: 'An art archivist shows us their work at a local ceramics company.'
  },
  {
    id: 'pos',
    title: 'Developing an MVP strategy for a new Point-of-Sale device',
    problem: 'The client is launching a point-of-sale (POS) product in 6 months, and are unsure who they should sell it to and what the experience should be.',
    methods: 'Secret shopper\n\nOn-the-street interviews\n\nEthnographic interviews\n\nCompetitive analysis',
    deliverables: 'A target-market, MVP, and design strategy.',
    outcomes: 'This product has successfully launched!',
    image: '/ps_truck.png',
    imageAlt: 'Small business owner demonstrating point of sale device',
    externalLink: 'https://www.dropbox.com/s/ng8apfubttiimeg/1%20-%20POS%20Research%20Sprint.pdf?dl=0',
    externalLinkText: 'Check out details in the pdf.',
    content: 'A small business owner demonstrating how they use their point of sale device.'
  }
];

export const getProjectById = (id: string): Project | undefined => {
  return projects.find(project => project.id === id);
}; 