import type { CVData } from '@/types'

// Primary persona used as default (senior tech/product — works for Modern/Executive/Creative)
export const mockCV_TechSenior: CVData = {
  personal: {
    fullName: 'Sarah Mitchell',
    jobTitle: 'Principal Product Designer',
    email: 'sarah.mitchell@gmail.com',
    phone: '+44 7700 900123',
    location: 'London, UK',
    linkedin: 'linkedin.com/in/sarahmitchell',
    website: 'sarahmitchell.design',
    photoUrl: 'https://i.pravatar.cc/120?img=47',
    summary:
      'Principal Product Designer with 10 years building consumer and fintech products. Led design for onboarding, payments, and growth funnels serving 12M MAU; combines systems thinking with hands-on research. Known for raising activation by 34%, reducing support tickets by 18%, and scaling design systems adopted by 7 squads.',
  },
  experience: [
    {
      id: 'exp_01',
      company: 'Spotify',
      role: 'Principal Product Designer',
      startDate: 'Mar 2022',
      endDate: 'Present',
      current: true,
      bullets: [
        'Led end-to-end redesign of mobile onboarding used by 12M MAU, improving activation by 34% and cutting drop-off by 18%.',
        'Owned payments UX for Premium; launched cross-platform checkout that lifted conversion by 9.4% across 5 markets.',
        'Built and governed the Polaris design system; adoption across 7 squads cut design-to-dev time by 22%.',
        'Partnered with data science to ship 14 growth experiments in 2024; 11 reached statistical lift (>95% confidence).',
        'Managed 4 designers and 2 researchers; instituted quarterly calibration that improved PM satisfaction to 4.7/5.',
        'Championed accessibility-first design sprints; Spotify-wide accessibility scorecards launched in Q4 2024.',
      ],
    },
    {
      id: 'exp_02',
      company: 'Monzo Bank',
      role: 'Senior Product Designer',
      startDate: 'Jun 2020',
      endDate: 'Feb 2022',
      current: false,
      bullets: [
        'Owned Monzo Plus subscription design from zero-to-one; 200K subscribers in first 90 days with 31% upsell rate.',
        'Ran 28 moderated tests and diary studies; insights reduced support tickets on open banking by 18%.',
        'Collaborated with compliance to deliver PSD2 flows ahead of FCA deadline; zero critical audit findings.',
        'Mentored 3 designers; formalized accessibility checklist that became bank-wide standard (WCAG AA).',
        'Instituted multi-variant experiment framework for product copy; activation up 6% without engineering effort.',
      ],
    },
    {
      id: 'exp_03',
      company: 'IDEO',
      role: 'Product/UX Designer',
      startDate: 'Aug 2018',
      endDate: 'May 2020',
      current: false,
      bullets: [
        'Delivered UX strategy for 6 client programs (healthcare, retail, finance) with teams of 5–8 cross-functional members.',
        'Facilitated 30+ design sprints; produced high-fidelity prototypes that unlocked £12m in follow-on engagements.',
        'Piloted accessibility-first redesign for an NHS portal; task success improved from 62% to 91% in user testing.',
        'Created research playbook that reduced discovery cycle time by 25% across the London studio.',
        'Built reusable component gallery that reduced proposal prep time by 18%.',
      ],
    },
    {
      id: 'exp_04',
      company: 'Fjord (Accenture Song)',
      role: 'UX Designer',
      startDate: 'Sep 2016',
      endDate: 'Jul 2018',
      current: false,
      bullets: [
        'Designed multi-platform booking flows for a travel client; increased mobile revenue share from 38% to 54%.',
        'Introduced component library that cut designer-onboarding time from 4 weeks to 2 weeks.',
        'Co-led client workshops with C-level stakeholders; aligned roadmap to £4m efficiency targets.',
        'Optimised IA for ecommerce catalogue (120k SKUs), reducing time-to-product by 19%.',
        'Built service blueprint for call-centre tooling; average handle time fell by 11%.',
      ],
    },
    {
      id: 'exp_05',
      company: 'Startup Studio',
      role: 'Product Designer',
      startDate: 'Jul 2014',
      endDate: 'Aug 2016',
      current: false,
      bullets: [
        'Shipped MVPs for 3 seed-stage products in health, mobility, and edtech; two raised follow-on funding (£1.2m total).',
        'Handled end-to-end research, IA, and UI for iOS/Android; maintained NPS >60 across pilot cohorts.',
        'Set up continuous discovery cadence (weekly interviews); backlog prioritisation improved cycle time by 30%.',
        'Partnered with engineers to implement analytics (Mixpanel); defined success metrics and dashboards.',
        'Facilitated brand systems and pitch materials that helped close two angel rounds.',
      ],
    },
    {
      id: 'exp_06',
      company: 'Freelance / Advisory',
      role: 'Product Design Advisor',
      startDate: 'Jan 2012',
      endDate: 'Jun 2014',
      current: false,
      bullets: [
        'Advised 8 early-stage startups on onboarding and monetisation; two products achieved product-market fit within 9 months.',
        'Delivered design audits and sprint facilitation; average uplift of 12% in activation across clients.',
        'Produced lightweight design systems and handoff kits that reduced engineering rework by ~20%.',
        'Coached founders on research methods and KPI selection; instituted first product analytics for 5 teams.',
      ],
    },
  ],
  education: [
    { id: 'edu_01', institution: 'Royal College of Art', degree: 'MA', field: 'Innovation Design Engineering', year: '2016' },
    { id: 'edu_02', institution: 'University of the Arts London', degree: 'BA (Hons)', field: 'Graphic Design', year: '2014' },
  ],
  skills: [
    'Design: Figma, Interaction Design, Prototyping, Design Systems',
    'Research: User Testing, Journey Mapping, Mixed-Methods, JTBD',
    'Systems: Accessibility (WCAG), Information Architecture, Tokens',
    'Tools: Framer, FigJam, Adobe XD, Sketch',
    'Collaboration: Agile Delivery, Experiment Design, OKRs',
  ],
  languages: ['English (Native)', 'French (Professional)', 'Spanish (Conversational)'],
  certifications: [
    'Nielsen Norman Group UX Certification — 2023',
    'Google UX Design Professional Certificate — 2021',
    'IDEO Design Thinking Facilitator — 2020',
  ],
}

// Operations persona for Professional/Classic
export const mockCV_OpsManager: CVData = {
  personal: {
    fullName: 'Daniel Okoro',
    jobTitle: 'Operations Manager',
    email: 'daniel.okoro@outlook.com',
    phone: '+1 415 200 8821',
    location: 'Austin, TX',
    linkedin: 'linkedin.com/in/danielokoro',
    photoUrl: 'https://i.pravatar.cc/120?img=15',
    summary:
      'Operations leader with 9 years improving fulfilment, CX, and vendor performance across e-commerce and logistics. Scaled teams from 12 to 40, drove on-time delivery from 87% to 96%, and reduced cost-per-order by 14% through process redesign and automation.',
  },
  experience: [
    {
      id: 'ops_01',
      company: 'Wayfair',
      role: 'Senior Operations Manager',
      startDate: 'Feb 2022',
      endDate: 'Present',
      current: true,
      bullets: [
        'Own end-to-end fulfilment ops for 3 DCs (480k sq ft); on-time delivery improved from 91% to 97% in 12 months.',
        'Led 38-person team (managers, planners, analysts); instituted weekly tiered stand-ups, cutting backlog by 22%.',
        'Launched carrier scorecards; underperforming lanes renegotiated, saving $2.4M annually.',
        'Deployed slotting optimisation with data science; pick-path distance reduced 11%, labor hours -8%.',
        'Implemented safety program (Near Miss tracking) that reduced recordables by 19% YoY.',
        'Piloted autonomous mobile robots in aisle 7/8; throughput +7% with no safety incidents.',
      ],
    },
    {
      id: 'ops_02',
      company: 'Amazon (Operations)',
      role: 'Area Manager II',
      startDate: 'Jul 2019',
      endDate: 'Jan 2022',
      current: false,
      bullets: [
        'Managed outbound operations with 140 associates across two shifts; peak-day throughput +18% vs LY.',
        'Drove defect rate down 23% via root-cause (5 Whys) and standard work updates across 4 process paths.',
        'Piloted robotics cell balancing; reduced conveyor jams 15% and improved SLA hits by 6 ppts.',
        'Promoted 6 high-potential associates into leadership through a structured readiness plan.',
        'Launched visual factory metrics; dock-to-stock time improved 9%.',
      ],
    },
    {
      id: 'ops_03',
      company: 'Instacart',
      role: 'Regional Ops Lead',
      startDate: 'Jan 2017',
      endDate: 'Jun 2019',
      current: false,
      bullets: [
        'Launched 12 micro-fulfilment sites; average time-to-live 21 days with cross-functional launch playbook.',
        'Negotiated 3PL contracts worth $6.5M; achieved 9% unit-cost reduction while maintaining SLA >96%.',
        'Built KPI dashboard (Tableau) for GM and finance; standardized weekly ops review cadence.',
        'Resolved union grievance risk by redesigning scheduling; absenteeism dropped 12%.',
        'Implemented cold-chain compliance checks; spoilage reduced by 8%.',
      ],
    },
    {
      id: 'ops_04',
      company: 'FedEx Ground',
      role: 'Operations Supervisor',
      startDate: 'Jun 2014',
      endDate: 'Dec 2016',
      current: false,
      bullets: [
        'Supervised 55 package handlers; peak-season throughput +25% with zero safety incidents.',
        'Introduced cross-dock layout change that trimmed trailer dwell time by 8 minutes per load.',
        'Created staffing model to match inbound curves; overtime reduced 10% while meeting service levels.',
        'Owned daily huddles and visual boards; improved scan compliance to 99.4%.',
        'Ran Kaizen on small-sort area; package missorts reduced by 14%.',
      ],
    },
    {
      id: 'ops_05',
      company: 'State Street Bank',
      role: 'Process Analyst',
      startDate: 'Aug 2012',
      endDate: 'May 2014',
      current: false,
      bullets: [
        'Mapped reconciliations process; automation saved 420 hours/quarter and cut errors by 35%.',
        'Co-led Lean Kaizen event; cycle time on exception handling reduced from 3.4 days to 1.9 days.',
        'Built control charts for daily volume; early-warning alerts reduced SLA breaches by 18%.',
        'Trained 15 analysts on new SOPs; onboarding time decreased by 30%.',
        'Established monthly quality council; backlog aged items reduced 26%.',
      ],
    },
    {
      id: 'ops_06',
      company: 'LogiRoute Consulting',
      role: 'Supply Chain Analyst',
      startDate: 'Jun 2010',
      endDate: 'Jul 2012',
      current: false,
      bullets: [
        'Modeled network redesign for regional retailer; transportation spend cut by 9% with unchanged SLA.',
        'Implemented vendor scorecards and quarterly business reviews for 14 suppliers.',
        'Built Access/SQL tooling to automate tender analysis; reduced cycle time from 10 days to 3 days.',
        'Conducted time-and-motion studies across 3 warehouses; findings informed $1.1M capex allocation.',
      ],
    },
  ],
  education: [
    { id: 'edu_11', institution: 'University of Texas at Austin', degree: 'BBA', field: 'Supply Chain Management', year: '2012' },
  ],
  skills: [
    'Operations: Fulfilment, Inventory Control, 3PL Management, SLAs',
    'Process: Lean, Kaizen, SOPs, Root Cause (5 Whys)',
    'Analytics: Forecasting, Tableau, Excel Modeling, KPI Dashboards',
    'People: Shift Leadership, Hiring, Coaching, Performance Management',
    'Tools: WMS, TMS, SQL (basic), Looker',
  ],
  languages: ['English (Native)', 'Spanish (Conversational)'],
  certifications: [
    'Lean Six Sigma Green Belt — 2020',
    'APICS CPIM — 2018',
  ],
}

// Academic persona for Academic template
export const mockCV_Academic: CVData = {
  personal: {
    fullName: 'Dr. Aisha Rahman',
    jobTitle: 'Research Scientist | Machine Learning',
    email: 'aisha.rahman@mit.edu',
    phone: '+1 617 555 4470',
    location: 'Cambridge, MA',
    linkedin: 'linkedin.com/in/aisharahman',
    website: 'aisharahman.ai',
    photoUrl: 'https://i.pravatar.cc/120?img=32',
    summary:
      'Research scientist focusing on trustworthy ML and healthcare applications. Published 9 peer-reviewed papers (NeurIPS, ICML, JAMA), led a 6-person lab team, and deployed risk stratification models that reduced false negatives by 18% in clinical pilots.',
  },
  experience: [
    {
      id: 'ac_01',
      company: 'MIT CSAIL',
      role: 'Postdoctoral Researcher',
      startDate: 'Sep 2022',
      endDate: 'Present',
      current: true,
      bullets: [
        'Lead a 6-person research group on bias mitigation in clinical ML; authored 3 first-author papers (NeurIPS, ICML).',
        'Co-designed a sepsis early warning model deployed in pilot ICU; reduced false negatives by 18% vs baseline.',
        'Secured $420k grant (NIH R01 sub-award) by writing technical aims and evaluation protocol.',
        'Mentor 4 PhD students; two won best-paper honorable mentions.',
        'Co-organized “ML for Health” workshop; 220 attendees, 18 accepted papers, 3 invited keynotes.',
      ],
    },
    {
      id: 'ac_02',
      company: 'Harvard Medical School / MGH',
      role: 'Research Fellow (ML in Healthcare)',
      startDate: 'Jul 2020',
      endDate: 'Aug 2022',
      current: false,
      bullets: [
        'Developed imaging model for stroke triage (AUC 0.91); integrated with PACS for clinician review.',
        'Published 4 peer-reviewed papers; co-led IRB process and clinical validation with 3 departments.',
        'Taught guest lectures for HMS BI 735 (ML in Medicine); average rating 4.8/5.',
        'Collaborated with radiology to design human-AI workflow; reading time reduced 12%.',
        'Partnered with QA to harden data pipelines; production incident rate fell 30%.',
      ],
    },
    {
      id: 'ac_03',
      company: 'University of Toronto Vector Institute',
      role: 'Graduate Research Assistant',
      startDate: 'Sep 2016',
      endDate: 'Jun 2020',
      current: false,
      bullets: [
        'Researched robustness in deep learning; co-authored 2 NeurIPS and 1 ICML papers.',
        'Implemented adversarial training pipeline; improved model robustness by 21% on CIFAR benchmarks.',
        'Organized weekly reading group (30+ attendees); improved cross-lab collaboration.',
        'Supervised 3 undergraduate theses; all published at workshops.',
        'Contributed to open-source robustness library; 1.2k GitHub stars.',
      ],
    },
    {
      id: 'ac_04',
      company: 'Element AI',
      role: 'Machine Learning Intern',
      startDate: 'May 2018',
      endDate: 'Aug 2018',
      current: false,
      bullets: [
        'Built named-entity recognition model for financial documents; F1 +9 points over baseline.',
        'Delivered production-ready inference service with monitoring; latency under 60ms p95.',
        'Documented reproducible training pipeline; reduced setup time from 2 days to 3 hours.',
        'Collaborated with product to design annotation UI; labeling throughput up 15%.',
      ],
    },
    {
      id: 'ac_05',
      company: 'Toronto General Hospital',
      role: 'Data Analyst (Part-time)',
      startDate: 'Jun 2015',
      endDate: 'Aug 2016',
      current: false,
      bullets: [
        'Developed survival analysis for cardiac unit; findings informed staffing model, saving ~$180k annually.',
        'Automated monthly quality reports; turnaround time cut from 5 days to same-day.',
        'Delivered clinician-friendly dashboards; adoption across 3 departments within 2 months.',
      ],
    },
    {
      id: 'ac_06',
      company: 'World Health Organization (Consultancy)',
      role: 'Data Science Consultant',
      startDate: 'Jun 2014',
      endDate: 'Aug 2015',
      current: false,
      bullets: [
        'Built outbreak surveillance prototype combining mobility and case data; reduced alert latency by 2 days in simulation.',
        'Trained 30+ public health analysts on Python and reproducible research practices.',
        'Produced governance guidelines for health-data sharing; adopted in two regional offices.',
        'Authored whitepaper on bias mitigation in low-resource settings; informed WHO digital health roadmap.',
      ],
    },
  ],
  education: [
    { id: 'ac_ed1', institution: 'University of Toronto', degree: 'PhD', field: 'Computer Science (Machine Learning)', year: '2020' },
    { id: 'ac_ed2', institution: 'University of Waterloo', degree: 'BMath', field: 'Statistics & CS', year: '2016' },
  ],
  skills: [
    'ML: Deep Learning, Probabilistic Modeling, Causal Inference',
    'Data: Python, PyTorch, TensorFlow, SQL, Pandas',
    'Research: Experiment Design, Peer Review, Grant Writing, IRB',
    'Healthcare: DICOM, HL7/FHIR, Clinical Validation, Explainability',
    'Leadership: Lab Mentorship, Cross-disciplinary Collaboration',
  ],
  languages: ['English (Native)', 'French (Intermediate)'],
  certifications: [
    'AWS Certified Machine Learning – Specialty — 2023',
    'Good Clinical Practice (GCP) Certification — 2022',
  ],
}

// Backward compatibility: default export used across the app
export const mockCVData = mockCV_TechSenior

export const mockJobDescription = `Senior Product Designer — Airbnb
We are looking for a Senior Product Designer to shape the future of travel experiences.
You will own end-to-end design across web and mobile, collaborating with product, engineering and data.
Requirements: 6+ years product design experience, strong systems thinking, Figma proficiency,
user research experience, track record shipping 0-to-1 products, excellent communication skills.`
