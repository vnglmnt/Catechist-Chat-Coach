const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  credentials: true
}));
app.use(express.json());
app.use(limiter);

// Import services
const aiService = require('./services/ai-service');

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', message: 'Catechist ChatCoach API is running' });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    const response = await aiService.generateChatResponse(message, context);
    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

app.post('/api/generate-lesson-plan', async (req, res) => {
  try {
    const { topic, ageGroup, duration, learningObjectives } = req.body;
    const lessonPlan = await aiService.generateLessonPlan(topic, ageGroup, duration, learningObjectives);
    res.json({ lessonPlan });
  } catch (error) {
    console.error('Lesson plan generation error:', error);
    res.status(500).json({ error: 'Failed to generate lesson plan' });
  }
});

app.post('/api/answer-question', async (req, res) => {
  try {
    const { question, ageGroup, context } = req.body;
    const answer = await aiService.generateFaithfulAnswer(question, ageGroup, context);
    res.json({ answer });
  } catch (error) {
    console.error('Answer generation error:', error);
    res.status(500).json({ error: 'Failed to generate answer' });
  }
});

app.post('/api/generate-activities', async (req, res) => {
  try {
    const { topic, ageGroup, activityType } = req.body;
    const activities = await aiService.generateActivities(topic, ageGroup, activityType);
    res.json({ activities });
  } catch (error) {
    console.error('Activities generation error:', error);
    res.status(500).json({ error: 'Failed to generate activities' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});