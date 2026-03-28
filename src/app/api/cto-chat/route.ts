import { NextRequest, NextResponse } from 'next/server';

const MINIMAX_API_URL = 'https://api.minimax.chat/v1/text/chatcompletion_pro';
const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY || '';

const INTRO = `Hey there! It's great to connect with you.

You can think of me as a friendly, virtual CTO. My goal today is to help you take that app idea you have and start putting a real structure around it. The best way to do that is to just talk it through.

I'll ask you a series of questions, one at a time, to get a really good, high-level understanding of what you want to build. We'll explore everything from the core features to the target audience. Don't worry about having all the answers perfectly polished; this is a brainstorming session!

Once we have a clear picture, I'll put together a comprehensive masterplan.md file for you. This will act as a high-level blueprint for your application—something you can use to guide your development process.

Ready to get started?

To begin, could you tell me a little bit about the app you're thinking of building? What's the big idea?`;

interface ChatContext {
  idea: string;
  targetAudience: string;
  platform: string;
  features: string;
  techStack: string;
  challenges: string;
}

let userContext: Partial<ChatContext> = {};

const QUESTIONS: Record<string, { q: string; field: keyof ChatContext }> = {
  targetAudience: {
    q: `That's really interesting! I want to make sure I understand who will be using this.

👥 **Who is your ideal user?** Could you tell me a bit more about them?
- What age group?
- What's their main goal when using the app?
- Are they tech-savvy or do we need to keep things super simple?`,
    field: 'targetAudience'
  },
  platform: {
    q: `Perfect! Now let's talk about how they'll access it.

📱 **What platform are you thinking?** Is this:
- A website (web app)?
- A mobile app (iOS, Android, or both)?
- Or something else entirely?

Also, will people access it mostly on their phones or desktops?`,
    field: 'platform'
  },
  features: {
    q: `Great question to ask! 🏗️

What are the **core features** you're envisioning for the MVP? 
- What can a user do on this app?
- What's the main action they take?

Try to list the top 3-5 features. Don't worry about getting it perfect—we'll refine this together!`,
    field: 'features'
  },
  techStack: {
    q: `Excellent list! Now let's talk about how we'll build it.

💻 **Have you thought about the tech stack?** 
- Any preferred programming languages or frameworks?
- Are you considering any backend services or databases?
- Do you have a preference for cloud platforms?

If you're not sure, that's totally fine! I can suggest some options based on what you're building.`,
    field: 'techStack'
  },
  challenges: {
    q: `That's very helpful! Before we wrap up, I want to make sure we don't miss anything important.

⚠️ **What challenges or concerns do you foresee?** 
- Any specific technical hurdles you're worried about?
- Are there any constraints (budget, time, skills)?
- Any "nice-to-have" features you'd love to add later?

This helps me create a more realistic and actionable plan for you.`,
    field: 'challenges'
  }
};

const questionOrder = ['targetAudience', 'platform', 'features', 'techStack', 'challenges'];
let currentQuestionIndex = 0;
let conversationCount = 0;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    if (!MINIMAX_API_KEY) {
      return NextResponse.json({ content: "MINIMAX_API_KEY is missing from the environment variables. Please add it to .env.local to enable the AI CTO." });
    }

    // Format messages for the MiniMax API
    // Ensure roles are mapped correctly. Often Minimax uses 'user' and 'assistant', and sometimes 'system'.
    const formattedMessages = messages.map((msg: { role: string; content: string }) => {
      // Map frontend roles ('cto', 'system') to standard LLM roles
      let role = 'user';
      if (msg.role === 'cto' || msg.role === 'assistant') role = 'assistant';
      if (msg.role === 'system') role = 'system';
      return { role, content: msg.content };
    });

    const response = await fetch(MINIMAX_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MINIMAX_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'abab6.5s-chat', // Using a reliable Minimax chat model since 'MiniMax-Text-01' might be deprecated or non-conversational
        tokens_to_generate: 3500,
        temperature: 0.7,
        messages: formattedMessages
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.choices?.[0]?.messages?.[0]?.text || data.choices?.[0]?.message?.content || '';

      const isMasterplan = content.toLowerCase().includes('masterplan') || content.includes('```markdown');

      return NextResponse.json({
        content: content,
        isMasterplan
      });
    } else {
      const errorText = await response.text();
      console.error('LLM API error:', errorText);
      return NextResponse.json({
        content: "I'm having trouble connecting to my neural network right now. Could you give me a second and try again?",
        error: true
      });
    }
  } catch (error) {
    console.error('Error in CTO chat:', error);
    return NextResponse.json({
      content: "I encountered an internal error. Let's try picking up where we left off.",
      error: true
    });
  }
}
