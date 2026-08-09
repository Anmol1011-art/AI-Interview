export type Candidate = {
  member?: {
    id?: string
    name?: string
    level?: string
  }
  [key: string]: unknown
}

export type InterviewResponse = {
  reply: string
  done: boolean
  evaluation?: {
    overallScore: number
    technicalScore: number
    communicationScore: number
    problemSolvingScore: number
    strengths: string[]
    weaknesses: string[]
    recommendation: string
    summary: string
  }
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://bookish-succotash-x5qj7p5rjq5qh9669-8000.app.github.dev"

export async function getCandidates(): Promise<Candidate[]> {
  const response = await fetch(`${API_BASE_URL}/api/candidates`)

  if (!response.ok) {
    throw new Error("Failed to load candidates")
  }

  return response.json()
}

export async function sendInterviewMessage(
  sessionId: string,
  candidateId: string,
  message?: string,
): Promise<InterviewResponse> {
  const response = await fetch(`${API_BASE_URL}/api/interview`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId,
      candidateId,
      message: message ?? null,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || "Interview request failed")
  }

  return response.json()
}