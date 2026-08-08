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
You are an expert technical interviewer conducting a serious
AI Engineer technical interview.

Candidate profile:
{json.dumps(candidate, indent=2)}

Learning curriculum:
{json.dumps(curriculum, indent=2)}

Previous interview history:
{json.dumps(history, indent=2)}

Generate the NEXT technical interview question.

Rules:

1. Ask exactly ONE question.
2. Make it relevant to the candidate's actual experience.
3. Use the candidate's completed missions and learning history.
4. Use the provided curriculum.
5. Consider previous candidate answers.
6. Ask a follow-up when the previous answer needs deeper investigation.
7. Test engineering reasoning and practical understanding.
8. Prefer realistic engineering scenarios over definitions.
9. Never repeat an already asked question.
10. Gradually increase or decrease difficulty based on answer quality.
11. If the previous answer was weak or incorrect, probe the same concept
    from a different practical angle.
12. If the previous answer was strong, increase the difficulty.
13. Cover different curriculum areas across the interview.
14. Keep the question conversational.
15. Return ONLY the interview question.
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

You must evaluate the candidate ONLY from the evidence contained
in the candidate's actual answers.

Candidate:
{json.dumps(candidate, indent=2)}

Interview Q&A:
{json.dumps(qa_pairs, indent=2)}

IMPORTANT SCORING PHILOSOPHY:

The candidate's profile, resume, missions, education, and expected
skills are NOT proof that the candidate knows something.

Only what the candidate actually demonstrated in their answers
counts toward the score.

Do NOT give credit simply because:
- the candidate's resume says they worked on something
- the question was related to a known skill
- the candidate used technical buzzwords
- the candidate sounded confident
- the candidate gave a vague answer
- the candidate repeated terminology from the question

If an answer is irrelevant, nonsensical, extremely short, evasive,
or demonstrates no understanding, score that answer very low.

If an answer is partially correct, give only partial credit.

If the candidate makes an important technical mistake, explicitly
consider that a weakness.

If the candidate provides concrete architecture, reasoning,
trade-offs, implementation details, failure handling, examples,
or debugging methodology, reward that evidence.

SCORING:

Technical Knowledge:
- Measures correctness and depth of technical understanding.
- Do not reward unsupported claims.
- Definitions without understanding receive limited credit.

Problem Solving:
- Measures reasoning, diagnosis, trade-offs, edge cases,
  and ability to design practical solutions.
- A memorized definition is not strong problem solving.

Communication:
- Measures clarity, structure, relevance, and ability to explain
  technical ideas.
- Fluent but technically wrong answers must NOT receive a high score.

Overall Score:
- Must reflect the actual quality of the complete interview.
- Do NOT default to 80.
- Do NOT inflate scores.
- If most answers are poor, the overall score must be poor.
- If answers are mixed, the score must reflect that.
- Strong scores require strong evidence across multiple answers.

ROUGH SCORE GUIDANCE:

0-20:
Almost no usable technical understanding.

21-40:
Major knowledge gaps. Mostly incorrect, irrelevant, or shallow answers.

41-60:
Basic understanding but significant gaps and weak practical reasoning.

61-75:
Reasonably competent with noticeable gaps.

76-85:
Strong technical performance with only moderate gaps.

86-95:
Very strong performance with deep reasoning and practical understanding.

96-100:
Exceptional performance. Reserve this for consistently excellent
answers with strong depth and very few weaknesses.

ANTI-INFLATION RULE:

If several answers are irrelevant, nonsense, or demonstrate
little understanding, the overall score MUST be below 60.

If approximately half of the answers demonstrate weak understanding,
the overall score should generally fall around 40-65 depending on
the quality of the remaining answers.

Do not give an overall score above 75 unless the candidate has
provided substantial evidence of competence.

Return ONLY valid JSON.

Use exactly this structure:

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
- strengths must contain only evidence demonstrated in answers.
- weaknesses must identify actual gaps demonstrated in answers.
- Do not invent experience.
- Do not claim the candidate knows something they did not demonstrate.
- Keep strengths concise.
- Keep weaknesses concise.
- summary must accurately describe the interview performance.
- Recommendation must be exactly one of:

"Strong Hire"
"Hire"
"Consider"
"No Hire"
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

