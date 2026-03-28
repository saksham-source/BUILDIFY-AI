# Buildify AI 🚀

Buildify AI is an intelligent virtual CTO and highly-structured technical planning assistant application built with Next.js, explicitly designed to help non-technical founders and developers brainstorm, architect, and structurally blueprint their startup ideas from scratch. 

## 🌟 Overview

The application initiates an active, fluid conversational interface, asking deep, nuanced questions about your Target Audience, Platform requirements, Tech Stack preferences, and anticipated Challenges. Once it has collected enough contextual depth, it dynamically generates an Engineering-Grade Masterplan using an advanced LLM backend.

### Key Features
- **Conversational CTO Node**: Mimics an expert Product Manager using multi-turn memory to uncover hidden layers within your core idea.
- **Dynamic Content Generation**: Leverages the Minimax AI API (`abab6.5s-chat` model) to synthesize highly accurate planning documents. 
- **10-Tier Architectural Outputs**: Rather than generic summaries, the final Masterplan splits outputs into deep categorizations such as "Conceptual Data Models", "Tech Stack Allocations", and strict "Security Configurations (RBAC)".
- **Light Theme "Sarvam" UI**: Fully modern, glassmorphic UI using Tailwind CSS designed to replicate production-tier institutional styling with gradient overlays and smooth transition states.

## 🛠 Tech Stack

- **Frontend**: React, Next.js (App Router), Tailwind CSS
- **Animations/UI**: Framer Motion, Lucide React icons
- **Backend / AI Proxy**: Next.js API Routes (`/api/cto-chat`)
- **Intelligence Engine**: Minimax Pro API

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Minimax API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/saksham-source/BUILDIFY-AI.git
   cd ai-co-founder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env.local` file and add your Minimax configuration:
   ```env
   MINIMAX_API_KEY=your_key_here
   ```

4. Run the Development Server:
   ```bash
   npm run dev
   ```
   *The server will typically start at \`http://localhost:3000\` or \`3001\`.*

## 📜 Masterplan Structure System
The CTO AI automatically routes the conversation's conclusion into a structured markdown render containing absolute startup milestones, technical risk assessments, user personas, MVP/V2 roadmapping checklists, and an executive roadmap.
