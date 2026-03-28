export interface StartupInput {
  name: string;
  description: string;
}

export interface StartupOverview {
  problemStatement: string;
  targetAudience: string;
  marketOpportunity: string;
  monetizationStrategy: string;
  mvpFeatures: string[];
  feasibilityScore: number;
  oneLinePitch: string;
}

export interface ProductSpec {
  coreFeatures: string[];
  pages: PageSpec[];
  userFlow: string[];
  techStack: TechSuggestion;
  scalingConsiderations: string;
}

export interface PageSpec {
  name: string;
  purpose: string;
  keyElements: string[];
}

export interface TechSuggestion {
  frontend: string;
  backend: string;
  database: string;
  deployment: string;
}

export interface FinalReport {
  overview: StartupOverview;
  productSpec: ProductSpec;
  startupName: string;
  tagline: string;
  generatedAt: Date;
}

export type ProcessingStep = {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed';
};
