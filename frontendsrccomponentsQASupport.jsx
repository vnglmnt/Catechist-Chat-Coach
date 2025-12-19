import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { QuestionMarkCircleIcon, BookOpenIcon } from '@heroicons/react/24/outline';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const QASupport = () => {
  const [formData, setFormData] = useState({
    question: '',
    ageGroup: 'teen',
    context: ''
  });
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sources, setSources] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.question.trim()) return;

    setIsLoading(true);
    setAnswer('');
    setSources([]);

    try {
      const response = await axios.post(`${API_BASE_URL}/answer-question`, {
        question: formData.question,
        ageGroup: formData.ageGroup,
        context: formData.context
      });

      setAnswer(response.data.answer);
      
      // Extract potential sources from answer
      extractSources(response.data.answer);
    } catch (error) {
      console.error('Error generating answer:', error);
      setAnswer('Error generating answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const extractSources = (text) => {
    const sourceRegex = /(CCC\s*\d+)|(Catechism\s*\d+)|(Matthew|Mark|Luke|John|Acts|Romans|[1-3]\s*[A-Za-z]+)/gi;
    const matches = text.match(sourceRegex) || [];
    const uniqueSources = [...new Set(matches.map(m => m.trim()))];
    setSources(uniqueSources.slice(0, 5));
  };

  const commonQuestions = [
    {
      question: "Why does God allow suffering?",
      ageGroup: "teen"
    },
    {
      question: "How do we know God exists?",
      ageGroup: "elementary"
    },
    {
      question: "What happens in the sacrament of Reconciliation?",
      ageGroup: "elementary"
    },
    {
      question: "Why do Catholics pray to Mary?",
      ageGroup: "teen"
    },
    {
      question: "What is the meaning of the Eucharist?",
      ageGroup: "adult"
    }
  ];

  const quickQuestion = (q, age) => {
    setFormData({
      question: q,
      ageGroup: age,
      context: ''
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-catholic-blue text-white">
          <div className="flex items-center space-x-3">
            <QuestionMarkCircleIcon className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Q&A Support</h2>
              <p className="text-blue-100">Get faithful answers based on Catholic teaching</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Common Questions</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {commonQuestions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => quickQuestion(item.question, item.ageGroup)}
                  className="text-left p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition border border-blue-200"
                >
                  <div className="flex items-start space-x-2">
                    <QuestionMarkCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800">{item.question}</p>
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full mt-1 inline-block">
                        {item.ageGroup}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Question *
              </label>
              <textarea
                name="question"
                value={formData.question}
                onChange={handleChange}
                required
                placeholder="Enter your faith-related question..."
                className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Who is asking? *
                </label>
                <select
                  name="ageGroup"
                  value={formData.ageGroup}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="preschool">Preschool child (3-5)</option>
                  <option value="elementary">Elementary student (6-11)</option>
                  <option value="teen">Teenager (12-17)</option>
                  <option value="adult">Adult (18+)</option>
                  <option value="catechist">Fellow catechist</option>
                  <option value="parent">Parent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Context (Optional)
                </label>
                <textarea
                  name="context"
                  value={formData.context}
                  onChange={handleChange}
                  placeholder="Any relevant background or specific concerns..."
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="2"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading || !formData.question.trim()}
                className="bg-gradient-to-r from-blue-600 to-catholic-blue text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating answer...
                  </span>
                ) : 'Get Faithful Answer'}
              </button>
            </div>
          </form>

          {answer && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Answer</h3>
                {sources.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <BookOpenIcon className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-600">Based on Church teaching</span>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border mb-6">
                <div className="prose prose-lg max-w-none">
                  <ReactMarkdown>{answer}</ReactMarkdown>
                </div>
              </div>

              {sources.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Suggested References</h4>
                  <div className="flex flex-wrap gap-2">
                    {sources.map((source, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white text-blue-700 rounded-full text-sm border border-blue-300"
                      >
                        {source}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-blue-600 mt-3">
                    Note: Always consult the actual Catechism, Scripture, or Church documents for complete teaching.
                  </p>
                </div>
              )}

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Pastoral Note</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        This AI-generated answer is meant to assist catechists but should not replace:
                        • Personal study of the Catechism and Scripture
                        • Consultation with your parish priest or diocesan catechetical office
                        • Formal theological education when needed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QASupport;