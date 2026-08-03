export interface LLMExplanation {
  summary: string;
  explanation: string;
  reasons: string[];
  manipulation_techniques: string[];
  political_bias: string;
  emotional_bias: string;
  propaganda_detection: string;
  clickbait_detection: string;
  suspicious_words: string[];
  confidence_reasoning: string;
  risk_score: number;
  suggestions: string[];
}

export interface FactCheckItem {
  source_name: string;
  source_url: string;
  claim_verdict: string;
  matching_info: string;
  trust_score: number;
}

export interface HighlightedSentence {
  id: number;
  text: string;
  is_suspicious: boolean;
  risk_level: "HIGH" | "MEDIUM" | "LOW";
  matched_triggers: string[];
}

export interface NLPFeatures {
  word_count: number;
  caps_ratio: number;
  exclamations: number;
  questions: number;
  sensational_score: number;
  triggered_words: string[];
}

export interface PredictionResponse {
  id?: number;
  prediction: "REAL" | "FAKE";
  confidence: number;
  fake_probability: number;
  real_probability: number;
  bias_score: number;
  emotion_score: number;
  trust_score: number;
  propaganda_score: number;
  clickbait_score: number;
  original_input: string;
  cleaned_text: string;
  nlp_features: NLPFeatures;
  llm_analysis: LLMExplanation;
  fact_checks: FactCheckItem[];
  highlighted_sentences: HighlightedSentence[];
  created_at?: string;
}

export interface User {
  id: number;
  email: string;
  full_name?: string;
  role: string;
}

export interface AnalyticsData {
  total_scans: number;
  real_count: number;
  fake_count: number;
  avg_confidence: number;
  avg_fake_prob: number;
  top_topics: { topic: string; count: number }[];
  weekly_trends: { day: string; real: number; fake: number }[];
}
