# AI Usage Log

## Project
AI Interview Agent

## Overview

This project was developed using AI-assisted development. AI was used for
architecture, backend implementation, frontend development, debugging,
interview logic, evaluation logic, and iterative refinement.

## Key AI-Assisted Development Areas

### 1. Project Architecture
Designed the architecture for a personalized AI technical interview agent
using FastAPI, React/TanStack, Gemini API, curriculum JSON, candidate JSON,
and session-based interview context.

### 2. Candidate Personalization
Implemented interview generation using candidate profiles, completed
curriculum missions, learning history, mission attempts, skipped topics,
and previous interview questions and answers.

### 3. Adaptive Interview
The interviewer adapts questions based on previous answers, avoids repetition,
changes difficulty, and uses practical engineering scenarios.

### 4. Interview Coverage
The interview is constrained to exactly 8 questions and at least 4 different
curriculum days/topics.

### 5. Final Evaluation
The final evaluation judges the candidate only from actual interview answers.
It evaluates technical knowledge, problem solving, communication, correctness,
depth, practical understanding, and engineering reasoning.

### 6. Frontend
AI assistance was used for the candidate selection, interview interface,
results page, API integration, and error handling.

### 7. Debugging
AI assistance was used to diagnose backend, frontend, Gemini API,
routing, build, and quota-related issues.

## Important Design Decision

Candidate profile information is used for interview personalization but is NOT
treated as evidence of technical competence.

Only demonstrated interview answers contribute to the final evaluation.

## Known Limitation

The application depends on Gemini API quota. When the quota is exhausted,
the backend returns a graceful error response.

## Requirements Implemented

- Conversational multi-turn interview
- Candidate-specific questions
- Interview session context
- Adaptive follow-up questions
- Exactly 8 interview questions
- At least 4 curriculum topics
- Structured final evaluation
- FastAPI HTTP API
- React/TanStack frontend
