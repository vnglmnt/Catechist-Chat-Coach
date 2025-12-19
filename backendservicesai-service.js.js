const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class AIService {
  constructor() {
    this.systemPrompt = `You are Catechist ChatCoach, an AI assistant for Catholic catechists and religious educators. Your role is to:

1. PROVIDE FAITHFUL TEACHING: All responses must align with the Catechism of the Catholic Church, Sacred Scripture, and Magisterial teaching.

2. GENERATE AGE-APPROPRIATE CONTENT: Adapt all responses to the specified age group (preschool, elementary, teen, adult).

3. OFFER PRACTICAL SUPPORT: Provide pedagogical strategies, activities, and reflections that are practical for catechists.

4. PROMOTE VALUES EDUCATION: Integrate moral and values development in all suggestions.

5. BE PASTORAL: Respond with charity, patience, and understanding.

CRITICAL CONSTRAINTS:
- Never contradict Church teaching
- Reference official Church documents when appropriate
- Suggest consulting with parish priest for sacramental matters
- Acknowledge when a question requires pastoral guidance
- Maintain Catholic orthodoxy in all responses`;
  }

  async generateChatResponse(message, context = {}) {
    const { ageGroup = 'adult', previousMessages = [] } = context;
    
    const messages = [
      { role: 'system', content: this.systemPrompt },
      ...previousMessages.slice(-10), // Keep last 10 messages for context
      { 
        role: 'user', 
        content: `As a catechist working with ${ageGroup} students, I need help with: ${message}`
      }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000
    });

    return response.choices[0].message.content;
  }

  async generateLessonPlan(topic, ageGroup, duration, learningObjectives = []) {
    const prompt = `Generate a Catholic catechetical lesson plan with these specifications:

Topic: ${topic}
Age Group: ${ageGroup}
Duration: ${duration} minutes
Learning Objectives: ${learningObjectives.join(', ') || 'To understand and appreciate the topic from a Catholic perspective'}

Please structure the lesson plan with:
1. OPENING PRAYER (age-appropriate)
2. LEARNING OBJECTIVES (clear and measurable)
3. SCRIPTURAL FOUNDATION (relevant Bible passages)
4. CATECHETICAL CONTENT (aligned with Catechism paragraphs)
5. ACTIVITIES (interactive and age-appropriate)
6. REFLECTION QUESTIONS
7. CLOSING PRAYER
8. MATERIALS NEEDED
9. ASSESSMENT SUGGESTIONS

Ensure the content is doctrinally sound and pedagogically effective.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    return response.choices[0].message.content;
  }

  async generateFaithfulAnswer(question, ageGroup, context = '') {
    const prompt = `Provide a faithful Catholic answer to this question from ${ageGroup} students:

Question: ${question}
Context: ${context}

Requirements:
1. Base the answer on Scripture, Catechism, and Church teaching
2. Use age-appropriate language and concepts
3. Include relevant Bible verses (with citations)
4. Reference Catechism paragraphs when applicable
5. Suggest follow-up activities if appropriate
6. Note if this requires pastoral consultation
7. Keep answer clear and charitable`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.5, // Lower temperature for more faithful answers
      max_tokens: 800
    });

    return response.choices[0].message.content;
  }

  async generateActivities(topic, ageGroup, activityType = 'any') {
    const prompt = `Generate ${activityType} activities for teaching "${topic}" to ${ageGroup} students in a Catholic catechetical setting.

Requirements:
1. Specify activity type (individual, small group, whole class)
2. List materials needed
3. Provide step-by-step instructions
4. Include faith connection explanation
5. Suggest variations for different abilities
6. Include assessment criteria
7. Connect to Values Education where appropriate`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 1000
    });

    return response.choices[0].message.content;
  }
}

module.exports = new AIService();