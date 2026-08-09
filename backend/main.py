import os
import json
import time
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from google.genai import errors


# =========================================================
# ENVIRONMENT
# =========================================================

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash")

if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY is missing in .env")

client = genai.Client(api_key=API_KEY)


# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(
    title="AI Interview Agent",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# FILE PATHS
# =========================================================

BASE_DIR = Path(__file__).resolve().parent.parent

CURRICULUM_PATH = BASE_DIR / "data" / "curriculum.json"
CANDIDATES_PATH = BASE_DIR / "data" / "candidates.json"


# =========================================================
# LOAD CURRICULUM
# =========================================================

with open(CURRICULUM_PATH, "r", encoding="utf-8") as f:
    curriculum = json.load(f)


# =========================================================
# LOAD CANDIDATES
# =========================================================

with open(CANDIDATES_PATH, "r", encoding="utf-8") as f:
    candidates_data = json.load(f)

candidates = candidates_data["candidates"]


# =========================================================
# INTERVIEW SESSIONS
# =========================================================

sessions = {}


# =========================================================
# REQUEST MODEL
# =========================================================

class InterviewRequest(BaseModel):
    sessionId: str
    candidateId: str | None = None
    candidate: dict | None = None
    message: str | None = None


# =========================================================
# GEMINI HELPER
# =========================================================

def call_gemini(prompt: str, retries: int = 2) -> str:
    """
    Calls Gemini with safe retry handling.

    503 = temporary availability problem -> retry.
    429 = quota/rate limit -> fail immediately.
    """

    last_error = None

    for attempt in range(retries):
        try:
            response = client.models.generate_content(
                model=MODEL,
                contents=prompt
            )

            if not response or not response.text:
                raise RuntimeError("Gemini returned an empty response.")

            return response.text.strip()

        except Exception as exc:
            last_error = exc
            error_text = str(exc)

            # 429 = quota/rate limit
            if "429" in error_text or "RESOURCE_EXHAUSTED" in error_text:
                raise RuntimeError(
                    "Gemini API quota exhausted. "
                    "Please wait for the quota to reset or use a project "
                    "with available Gemini API quota."
                ) from exc

            # 503 = temporary model availability problem
            if "503" in error_text or "UNAVAILABLE" in error_text:
                if attempt < retries - 1:
                    time.sleep(2 + attempt * 2)
                    continue

            raise RuntimeError(
                f"Gemini request failed: {error_text}"
            ) from exc

    raise RuntimeError(
        f"Gemini unavailable after {retries} attempts: {last_error}"
    )
# =========================================================
# GEMINI — GENERATE INTERVIEW QUESTION
# =========================================================

def generate_question(candidate, history):
    prompt = f"""
You are an expert technical interviewer conducting a serious AI Engineer
technical interview.

Candidate profile:
{json.dumps(candidate, indent=2)}

Learning curriculum:
{json.dumps(curriculum, indent=2)}

Previous interview history:
{json.dumps(history, indent=2)}

Generate the NEXT technical interview question.

STRICT INTERVIEW REQUIREMENTS:

- The complete interview has exactly 8 questions.
- By the end of the interview, at least 4 DIFFERENT curriculum days/topics
  MUST have been assessed.
- Prefer curriculum topics that this candidate actually completed.
- Do not ask all questions from one topic.
- Inspect previous questions before selecting the next topic.
- If fewer than 4 different topics have been covered, prefer an uncovered
  completed curriculum topic.
- After 4 different topics are covered, use intelligent follow-ups and
  deeper probing based on answer quality.

Rules:

1. Ask exactly ONE question.
2. Make it relevant to the candidate's actual experience.
3. Use the candidate's completed missions and learning history.
4. Use the provided curriculum.
5. Consider all previous interview questions and answers.
6. Ask a follow-up when the previous answer needs deeper investigation.
7. Test engineering reasoning and practical understanding.
8. Prefer realistic engineering scenarios over definitions.
9. Never repeat an already asked question.
10. Increase or decrease difficulty based on demonstrated answer quality.
11. If the previous answer was weak or incorrect, probe the same concept
    from a different practical angle.
12. If the previous answer was strong, increase the difficulty.
13. Ensure at least 4 distinct curriculum days/topics by question 8.
14. Prefer topics supported by completed missions.
15. Avoid skipped or failed topics unless necessary.
16. Test practical decisions, trade-offs, debugging, architecture,
    implementation, failure handling, or engineering reasoning.
17. Keep the question conversational.
18. Return ONLY the interview question.
19. Do not return numbering, labels, explanations, markdown, or JSON.
"""
    return call_gemini(prompt)

# =========================================================
# GEMINI — FINAL EVALUATION
# =========================================================

def generate_final_evaluation(candidate, questions, answers):

    # Pair every question with the corresponding answer.
    qa_pairs = []

    for index, question in enumerate(questions):
        answer = answers[index] if index < len(answers) else ""

        qa_pairs.append({
            "questionNumber": index + 1,
            "question": question,
            "answer": answer
        })

    prompt = f"""
You are a STRICT senior technical interviewer.

Evaluate the candidate ONLY from the candidate's actual interview answers.

Candidate:
{json.dumps(candidate, indent=2)}

Interview Q&A:
{json.dumps(qa_pairs, indent=2)}

IMPORTANT:
The candidate profile, resume, education, missions, job title, expected skills,
and previous experience are NOT evidence of knowledge.

ONLY demonstrated evidence in the actual answers counts.

For EACH question, internally judge the answer before calculating the final scores.

For each answer determine:
- correctness
- depth of understanding
- reasoning quality
- practical understanding
- technical mistakes
- relevance to the question

Answer quality:
- Fully correct and deeply explained = high credit
- Correct but incomplete = partial/high credit
- Partially correct = partial credit
- Mostly incorrect = low credit
- Incorrect, irrelevant, evasive, nonsensical, or no meaningful answer = very low credit

Technical Knowledge:
Measure actual technical correctness and depth.
Do not reward buzzwords or confident claims without explanation.

Problem Solving:
Measure reasoning, diagnosis, trade-offs, edge cases, architecture,
implementation decisions, debugging, and failure handling.
Definitions alone are not strong problem solving.

Communication:
Measure clarity, structure, relevance, and ability to explain.
Fluent but technically incorrect answers must still receive low scores.

OVERALL SCORE CALIBRATION:

0-20: Almost no usable understanding.
21-40: Mostly incorrect or extremely shallow.
41-60: Basic understanding with major gaps.
61-70: Moderate competence with significant weaknesses.
71-75: Reasonably strong but noticeable gaps.
76-85: Strong performance with moderate gaps.
86-95: Very strong performance with deep reasoning.
96-100: Exceptional and consistently excellent.

STRICT ANTI-INFLATION RULES:

- Do NOT default to 80.
- Do NOT give a high score because some answers are strong.
- Several weak answers must materially lower the final score.
- If approximately half the answers are weak, overallScore should generally be 40-65.
- If several answers are clearly incorrect, overallScore should generally be below 70.
- Do NOT give overallScore above 75 unless the majority of answers provide substantial evidence of competence.
- Do NOT give overallScore above 85 unless the candidate demonstrates strong correctness,
  reasoning, and practical depth across multiple answers.
- One excellent answer must NOT compensate for several poor answers.
- Important technical mistakes must be reflected in weaknesses and scores.
- The final score must represent the complete interview, not the candidate's potential.

Return ONLY valid JSON.

Use exactly:

{{
    "overallScore": 0,
    "technicalScore": 0,
    "communicationScore": 0,
    "problemSolvingScore": 0,
    "strengths": [],
    "weaknesses": [],
    "recommendation": "",
    "summary": ""
}}

Additional rules:
- All scores must be integers from 0 to 100.
- strengths must contain only demonstrated evidence.
- weaknesses must contain actual demonstrated gaps or mistakes.
- Do not invent experience.
- Do not claim knowledge that was not demonstrated.
- Keep strengths and weaknesses concise.
- Recommendation must be exactly:
  "Strong Hire", "Hire", "Consider", or "No Hire".
- The summary must accurately describe the complete interview.
"""

    try:
        text = call_gemini(prompt)

        # Gemini sometimes returns JSON inside markdown fences.
        if text.startswith("```"):
            text = text.replace("```json", "")
            text = text.replace("```", "")
            text = text.strip()

        evaluation = json.loads(text)

        # -------------------------------------------------
        # SANITIZE SCORES
        # -------------------------------------------------

        score_fields = [
            "overallScore",
            "technicalScore",
            "communicationScore",
            "problemSolvingScore"
        ]

        for field in score_fields:
            value = evaluation.get(field, 0)

            try:
                value = int(value)
            except (TypeError, ValueError):
                value = 0

            evaluation[field] = max(0, min(100, value))

        # -------------------------------------------------
        # SANITIZE ARRAYS
        # -------------------------------------------------

        if not isinstance(evaluation.get("strengths"), list):
            evaluation["strengths"] = []

        if not isinstance(evaluation.get("weaknesses"), list):
            evaluation["weaknesses"] = []

        # -------------------------------------------------
        # SANITIZE RECOMMENDATION
        # -------------------------------------------------

        valid_recommendations = {
            "Strong Hire",
            "Hire",
            "Consider",
            "No Hire"
        }

        if evaluation.get("recommendation") not in valid_recommendations:
            evaluation["recommendation"] = "Consider"

        if not isinstance(evaluation.get("summary"), str):
            evaluation["summary"] = ""

        return evaluation

    except Exception as exc:

        print("Evaluation error:", repr(exc))

        return {
            "overallScore": 0,
            "technicalScore": 0,
            "communicationScore": 0,
            "problemSolvingScore": 0,
            "strengths": [],
            "weaknesses": [
                "Final AI evaluation could not be generated."
            ],
            "recommendation": "Consider",
            "summary": (
                "The interview was completed, but the final AI "
                "evaluation service was temporarily unavailable."
            )
        }


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():
    return {
        "message": "AI Interview Agent is running"
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health():
    return {
        "status": "ok"
    }


# =========================================================
# GET ALL CANDIDATES
# =========================================================

@app.get("/api/candidates")
def get_candidates():
    return candidates


# =========================================================
# GET SINGLE CANDIDATE
# =========================================================

@app.get("/api/candidates/{candidate_id}")
def get_candidate(candidate_id: str):

    for candidate in candidates:

        member = candidate.get("member", {})

        if member.get("id") == candidate_id:
            return candidate

    return {
        "error": "Candidate not found"
    }


# =========================================================
# START / CONTINUE INTERVIEW
# =========================================================

@app.post("/api/interview")
def interview(request: InterviewRequest):

    session_id = request.sessionId

    # =====================================================
    # START NEW INTERVIEW
    # =====================================================

    if session_id not in sessions:

        if request.candidate is None and not request.candidateId:

            return {
                "reply": "candidate or candidateId is required to start the interview.",
                "done": False
            }

        # -------------------------------------------------
        # RESOLVE CANDIDATE
        # -------------------------------------------------

        candidate = request.candidate

        if candidate is None:

            for item in candidates:

                member = item.get("member", {})

                if member.get("id") == request.candidateId:

                    candidate = item
                    break

        # -------------------------------------------------
        # CANDIDATE NOT FOUND
        # -------------------------------------------------

        if candidate is None:

            return {
                "reply": "Candidate not found.",
                "done": False
            }

        # -------------------------------------------------
        # CREATE SESSION
        # -------------------------------------------------

        sessions[session_id] = {

            "candidate": candidate,

            "questions": [],

            "answers": [],

            "question_count": 0,

            "evaluation": None
        }

        # -------------------------------------------------
        # GENERATE FIRST QUESTION
        # -------------------------------------------------

        try:

            question = generate_question(
                candidate=candidate,
                history=[]
            )

        except Exception as exc:

            print("Question generation error:", repr(exc))

            return {
                "reply": (
                    "The interview AI is temporarily unavailable. "
                    "Please try starting the interview again."
                ),
                "done": False,
                "error": True
            }

        sessions[session_id]["questions"].append(question)

        sessions[session_id]["question_count"] = 1

        return {
            "reply": question,
            "done": False
        }
    # EXISTING INTERVIEW
    # =====================================================

    session = sessions[session_id]

    # -----------------------------------------------------
    # SAVE CANDIDATE ANSWER
    # -----------------------------------------------------

    if request.message is not None:

        session["answers"].append(
            request.message
        )

    # =====================================================
    # FINISH AFTER 8 QUESTIONS
    # =====================================================

    if session["question_count"] >= 8:

        evaluation = generate_final_evaluation(

            candidate=session["candidate"],

            questions=session["questions"],

            answers=session["answers"]
        )

        session["evaluation"] = evaluation

        return {

            "reply": "Interview completed. Thank you for your time.",

            "done": True,

            "evaluation": evaluation
        }

    # =====================================================
    # PREVIOUS INTERVIEW HISTORY
    # =====================================================

    history = {

        "questions": session["questions"],

        "answers": session["answers"]
    }

    # =====================================================
    # GENERATE NEXT QUESTION
    # =====================================================

    try:

        question = generate_question(

            candidate=session["candidate"],

            history=history
        )

    except Exception as exc:

        print("Question generation error:", repr(exc))

        return {

            "reply": (
                "I had trouble generating the next question. "
                "Please try submitting your answer again."
            ),

            "done": False,

            "error": True
        }

    # -----------------------------------------------------
    # SAVE QUESTION
    # -----------------------------------------------------

    session["questions"].append(
        question
    )

    session["question_count"] += 1

    return {

        "reply": question,

        "done": False
    }


# =========================================================
# GET INTERVIEW SESSION
# =========================================================

@app.get("/api/interview/{session_id}")
def get_interview_session(session_id: str):

    if session_id not in sessions:

        return {
            "error": "Interview session not found"
        }

    session = sessions[session_id]

    return {

        "sessionId": session_id,

        "candidate": session["candidate"],

        "questions": session["questions"],

        "answers": session["answers"],

        "questionCount": session["question_count"],

        "evaluation": session.get("evaluation")
    }

