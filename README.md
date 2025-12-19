# Catechist ChatCoach

An AI-powered assistant for Catholic catechists and religious educators.

## Features

- **AI Chat Mentor**: Get guidance on teaching strategies and catechetical methods
- **Lesson Plan Generator**: Create age-appropriate lesson plans aligned with Catholic teaching
- **Q&A Support**: Faithful answers to difficult questions based on Church documents
- **Activity Suggestions**: Pedagogical strategies and moral development activities

## Prerequisites

1. OpenAI API key (GPT-4 recommended)
2. Node.js 18+ and npm
3. MongoDB (optional for future features)
4. Docker and Docker Compose (for containerized deployment)

## Quick Start

### Option 1: Docker Deployment (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/catechist-chatcoach.git
cd catechist-chatcoach

# Set up environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your OpenAI API key

# Start with Docker Compose
docker-compose up -d