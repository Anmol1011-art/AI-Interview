# AI Usage Log

This file documents the AI-assisted development process used to build the AI Interview Agent.

## Project Planning
- Used AI assistance to understand the project requirements and convert them into an implementation plan.
- Used AI to reason about the interview flow, candidate management, evaluation, scoring, and frontend/backend integration.

## Backend Development
- Used AI assistance to design and implement the FastAPI backend.
- Used AI assistance for Gemini API integration and interview question generation.
- Used AI assistance to design the final interview evaluation prompt.
- Used AI assistance to improve evaluation so scores are based on demonstrated answers rather than candidate profile claims.
- Used AI assistance to add error handling for Gemini API failures and quota errors.

## Frontend Development
- Used AI assistance to build and refine the candidate selection, interview, and results flows.
- Used AI assistance to connect frontend API calls with the FastAPI backend.
- Used AI assistance to debug interview submission and question-count behavior.

## Debugging
- Used AI assistance to diagnose Gemini model availability and API quota errors.
- Used AI assistance to debug interview answer submission failures and backend session handling.
- Used AI assistance to validate the final project against the submission requirements.

## Evaluation Prompting
The evaluation system was explicitly instructed to:
- Evaluate only evidence demonstrated in candidate answers.
- Avoid giving credit based only on resumes, profiles, or expected skills.
- Penalize irrelevant, nonsensical, evasive, or technically incorrect answers.
- Reward concrete reasoning, architecture, trade-offs, implementation details, and failure handling.
- Avoid inflated scores and require strong evidence for high scores.

## Human Direction
AI was used as a development and debugging assistant. Product decisions, requirements, testing decisions, and final project direction were reviewed and directed by the project author.
