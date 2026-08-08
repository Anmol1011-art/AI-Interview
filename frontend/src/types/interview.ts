export type Role = "ai" | "candidate"

export type Difficulty =
  | "Foundational"
  | "Intermediate"
  | "Advanced"

export interface ChatTurn {
  id: string
  role: Role
  content: string
  topic?: string
  isFollowUp?: boolean
  difficulty?: Difficulty
}

export interface InterviewSignals {
  technicalDepth: number
  practicalUnderstanding: number
  problemSolving: number
}

export interface InterviewState {
  questionIndex: number
  totalQuestions: number
  difficulty: Difficulty
  coveredTopics: string[]
  activeTopic: string
  signals: InterviewSignals
}

export interface SubmitAnswerResult {
  candidateTurn: ChatTurn
  aiTurn: ChatTurn
  state: InterviewState
  finished: boolean
}

export interface Candidate {
  id: string
  name: string
  level: string
  progress: number
  daysCompleted: number
  completedAreas: string[]
  focusAreas: string[]
}

export interface Evaluation {
  overallScore: number
  technicalKnowledge: number
  problemSolving: number
  communication: number
  practicalDepth: number
  strengths: string[]
  gaps: string[]
  summary: string
}