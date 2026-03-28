import { NextRequest, NextResponse } from 'next/server';
import { chatWithFallback, generateSynthesizedMasterplan } from '@/lib/ai-client';

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
  features: string[];
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

    const userMessages = messages.filter((m: { role: string }) => m.role === 'user');
    const numUserMessages = userMessages.length;

    if (numUserMessages === 0) {
      conversationCount = 0;
      currentQuestionIndex = 0;
      userContext = {};
      return NextResponse.json({ content: INTRO, questionKey: 'intro' });
    }

    const lastUserMessage = userMessages[numUserMessages - 1]?.content || '';

    if (numUserMessages === 1) {
      userContext.idea = lastUserMessage;
    }

    const ctoPrompt = `You are a friendly virtual CTO helping an entrepreneur brainstorm their app idea.
User's idea: ${userContext.idea || lastUserMessage}

Based on the conversation so far, ask a follow-up question or provide guidance.
Keep responses conversational, friendly, and under 200 words.
Ask one focused question at a time to understand the idea better.`;

    const fallbackQuestion = numUserMessages >= 1 && numUserMessages < 6
      ? (() => {
        const questionKey = questionOrder[numUserMessages - 1];
        if (questionKey && QUESTIONS[questionKey]) {
          const { q, field } = QUESTIONS[questionKey];
          userContext[field] = lastUserMessage;
          return q;
        }
        return null;
      })()
      : null;

    const fallbackResponse = fallbackQuestion || `That's great! Let me help you think through this more. What specific problem does your app solve?`;

    const aiResponse = await chatWithFallback(messages, fallbackResponse);

    if (aiResponse.model === 'fallback') {
      if (fallbackQuestion) {
        userContext[questionOrder[numUserMessages - 1] as keyof ChatContext] = lastUserMessage;
        return NextResponse.json({
          content: fallbackQuestion,
          questionKey: questionOrder[numUserMessages - 1],
          context: userContext,
          model: 'fallback'
        });
      }
    }

    if (numUserMessages >= 1 && numUserMessages < 6) {
      const questionKey = questionOrder[numUserMessages - 1];
      if (questionKey && QUESTIONS[questionKey]) {
        const { q, field } = QUESTIONS[questionKey];
        userContext[field] = lastUserMessage;
        return NextResponse.json({
          content: aiResponse.content || q,
          questionKey,
          context: userContext,
          model: aiResponse.model
        });
      }
    }

    userContext.challenges = lastUserMessage;
    currentQuestionIndex = 0;

    let masterplanStr = '';
    let finalModel = aiResponse.model;

    try {
      const synthesis = await generateSynthesizedMasterplan(userContext);
      masterplanStr = synthesis.content;
      finalModel = synthesis.model as any;
    } catch (e) {
      console.error("Synthesis failed, falling back to basic outline:", e);
      masterplanStr = `# ${userContext.idea?.split('\n')[0] || 'Product'} Masterplan
**Version: 1.0 (Fallback)**
... Unable to generate AI insights due to missing or invalid keys ...`;
    }

    return NextResponse.json({
      content: `That's incredibly helpful! You've given me a really clear picture.

I have everything I need to create your masterplan. This has been a great conversation—I'm impressed by how well you've thought through your idea.

I just asked my internal teams (Minimax Architecture and Google Market Trends) to analyze your inputs. Let me synthesize their drafts into a masterplan.md file for you. This will act as your high-level blueprint.

Give me just a moment to generate it for you!\n\n---\n\n${masterplanStr}\n\n---\n\n**That's your masterplan!** Take a look through it. Would you like me to adjust anything or dive deeper into any particular section?`,
      isMasterplan: true,
      context: userContext,
      model: finalModel
    });

  } catch (error) {
    console.error('Error in CTO chat:', error);
    return NextResponse.json({
      content: "I'm sorry, I ran into an issue. Could you tell me more about your app idea?",
      error: true
    });
  }
}
