import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const LessonPlanGenerator = () => {
  const [formData, setFormData] = useState({
    topic: '',
    ageGroup: 'elementary',
    duration: '60',
    learningObjectives: '',
  });
  const [lessonPlan, setLessonPlan] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setLessonPlan('');

    try {
      const objectives = formData.learningObjectives
        .split(',')
        .map(obj => obj.trim())
        .filter(obj => obj.length > 0);

      const response = await axios.post(`${API_BASE_URL}/generate-lesson-plan`, {
        topic: formData.topic,
        ageGroup: formData.ageGroup,
        duration: formData.duration,
        learningObjectives: objectives
      });

      setLessonPlan(response.data.lessonPlan);
    } catch (error) {
      console.error('Error generating lesson plan:', error);
      setLessonPlan('Error generating lesson plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const sampleTopics = [
    'The Sacrament of Baptism',
    'The Ten Commandments',
    'The Life of Jesus',
    'The Holy Spirit',
    'The Mass Explained',
    'Mary, Mother of God',
    'Social Justice',
    'The Virtues',
    'The Works of Mercy'
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-purple-600 to-catholic-blue text-white">
          <div className="flex items-center space-x-3">
            <DocumentTextIcon className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Lesson Plan Generator</h2>
              <p className="text-purple-100">Create faithful, age-appropriate lesson plans in minutes</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic *
                </label>
                <input
                  type="text"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  required
                  placeholder="e.g., The Eucharist, Prayer, Saints..."
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-2">Quick picks:</p>
                  <div className="flex flex-wrap gap-2">
                    {sampleTopics.map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, topic }))}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age Group *
                </label>
                <select
                  name="ageGroup"
                  value={formData.ageGroup}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="preschool">Preschool (3-5 years)</option>
                  <option value="elementary">Elementary (6-11 years)</option>
                  <option value="teen">Teen (12-17 years)</option>
                  <option value="adult">Adult (18+ years)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes) *
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                  <option value="120">120 minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Learning Objectives
                </label>
                <textarea
                  name="learningObjectives"
                  value={formData.learningObjectives}
                  onChange={handleChange}
                  placeholder="Separate objectives with commas..."
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  rows="3"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Leave blank for AI to suggest appropriate objectives
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isGenerating || !formData.topic}
                className="bg-gradient-to-r from-purple-600 to-catholic-blue text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isGenerating ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </span>
                ) : 'Generate Lesson Plan'}
              </button>
            </div>
          </form>

          {lessonPlan && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Generated Lesson Plan</h3>
                <button
                  onClick={() => {
                    const blob = new Blob([lessonPlan], { type: 'text/markdown' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `Lesson_Plan_${formData.topic.replace(/\s+/g, '_')}.md`;
                    a.click();
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Download as Markdown
                </button>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border">
                <div className="prose prose-lg max-w-none">
                  <ReactMarkdown>{lessonPlan}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonPlanGenerator;