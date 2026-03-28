import { StartupOverview, ProductSpec, FinalReport, StartupInput } from '@/types';

const MINIMAX_API_URL = 'https://api.minimax.chat/v1/text/chatcompletion_pro';
const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY || '';

export async function generateOverview(input: StartupInput): Promise<StartupOverview> {
  const prompt = `Act as a startup advisor.

Startup Name: ${input.name}
Description: ${input.description}

Generate a structured startup analysis in JSON format with these exact fields:
1. problemStatement - clear description of the problem being solved
2. targetAudience - who is this for (demographics, behaviors, pain points)
3. marketOpportunity - brief market size and opportunity
4. monetizationStrategy - how will this make money
5. mvpFeatures - array of 5-6 key features for MVP (bullet points)
6. feasibilityScore - number 1-10 with brief reason
7. oneLinePitch - compelling one-sentence pitch

Return ONLY valid JSON, no markdown or extra text.`;

  const response = await fetch(MINIMAX_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MINIMAX_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'MiniMax-Text-01',
      tokens_to_generate: 1024,
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that responds in JSON format only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    }),
  });

  if (!response.ok) {
    throw new Error(`MiniMax API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.messages?.[0]?.text || data.choices?.[0]?.message?.content;
  
  try {
    return JSON.parse(content);
  } catch {
    return parseOverviewFallback(content, input);
  }
}

export async function generateProductSpec(overview: StartupOverview, startupName: string): Promise<ProductSpec> {
  const prompt = `Act as a senior product manager.

Based on this startup:
Name: ${startupName}
Problem: ${overview.problemStatement}
Target Audience: ${overview.targetAudience}
MVP Features: ${overview.mvpFeatures.join(', ')}

Generate a full product specification in JSON format with these exact fields:
1. coreFeatures - array of 6-8 key product features
2. pages - array of page objects with name, purpose, and keyElements array
3. userFlow - array of steps for user journey
4. techStack - object with frontend, backend, database, deployment suggestions
5. scalingConsiderations - brief notes on how to scale

Return ONLY valid JSON, no markdown or extra text.`;

  const response = await fetch(MINIMAX_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MINIMAX_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'MiniMax-Text-01',
      tokens_to_generate: 1024,
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that responds in JSON format only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    }),
  });

  if (!response.ok) {
    throw new Error(`MiniMax API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.messages?.[0]?.text || data.choices?.[0]?.message?.content;
  
  try {
    return JSON.parse(content);
  } catch {
    return parseProductSpecFallback(content);
  }
}

function parseOverviewFallback(content: string, input: StartupInput): StartupOverview {
  return {
    problemStatement: `Users struggle with ${input.description || 'the challenge mentioned'}`,
    targetAudience: 'Early adopters, tech-savvy professionals aged 25-45',
    marketOpportunity: 'Growing market with significant untapped potential',
    monetizationStrategy: 'Freemium model with premium features',
    mvpFeatures: [
      'User authentication and profile management',
      'Core functionality dashboard',
      'Basic analytics and reporting',
      'Email notifications',
      'Mobile responsive design'
    ],
    feasibilityScore: 7,
    oneLinePitch: `${input.name} helps users achieve more with less effort`
  };
}

function parseProductSpecFallback(content: string): ProductSpec {
  return {
    coreFeatures: [
      'User authentication and onboarding',
      'Interactive dashboard with real-time data',
      'Search and filtering capabilities',
      'User settings and preferences',
      'Analytics and insights',
      'Notification system'
    ],
    pages: [
      { name: 'Landing Page', purpose: 'First impression and value proposition', keyElements: ['Hero section', 'Features overview', 'CTA'] },
      { name: 'Dashboard', purpose: 'Main workspace for users', keyElements: ['Quick stats', 'Recent activity', 'Quick actions'] },
      { name: 'Settings', purpose: 'User preferences management', keyElements: ['Profile', 'Notifications', 'Privacy'] }
    ],
    userFlow: ['Sign up → Onboarding → Dashboard → Use features → Track progress'],
    techStack: {
      frontend: 'Next.js + Tailwind CSS',
      backend: 'Node.js with Express',
      database: 'PostgreSQL',
      deployment: 'Vercel'
    },
    scalingConsiderations: 'Consider microservices architecture and CDN for assets'
  };
}
