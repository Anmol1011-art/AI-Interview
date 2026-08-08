import type { Candidate, Evaluation } from "#/types/interview"

export const mockCandidates: Candidate[] = [
  {
    id: "CAND-001",
    name: "Candidate 001",
    level: "AI Engineer",
    progress: 82,
    daysCompleted: 26,
    completedAreas: [
      "RAG",
      "Vector Search",
      "Prompt Engineering",
      "Agentic AI",
    ],
    focusAreas: ["MCP", "Production AI"],
  },
  {
    id: "CAND-002",
    name: "Candidate 002",
    level: "ML Engineer",
    progress: 68,
    daysCompleted: 21,
    completedAreas: [
      "Data Foundations",
      "Embeddings",
      "RAG",
      "Prompt Engineering",
    ],
    focusAreas: ["Agents", "Deployment"],
  },
  {
    id: "CAND-003",
    name: "Candidate 003",
    level: "AI Developer",
    progress: 54,
    daysCompleted: 17,
    completedAreas: [
      "Python",
      "Data Foundations",
      "Embeddings",
    ],
    focusAreas: ["RAG", "Agents"],
  },
]

export const mockEvaluation: Evaluation = {
  overallScore: 82,
  technicalKnowledge: 86,
  problemSolving: 79,
  communication: 88,
  practicalDepth: 74,
  strengths: [
    "Strong understanding of RAG and grounding concepts.",
    "Communicates technical ideas clearly.",
    "Understands embeddings and semantic retrieval.",
  ],
  gaps: [
    "MCP interoperability needs deeper understanding.",
    "Production AI failure handling could be stronger.",
  ],
  summary:
    "Strong conceptual understanding with good communication and developing production-level reasoning.",
}