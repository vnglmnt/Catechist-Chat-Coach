import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChatBubbleLeftRightIcon, DocumentTextIcon, QuestionMarkCircleIcon, HomeIcon } from '@heroicons/react/24/outline';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: HomeIcon },
    { path: '/chat', label: 'Chat Mentor', icon: ChatBubbleLeftRightIcon },
    { path: '/lesson-plans', label: 'Lesson Plans', icon: DocumentTextIcon },
    { path: '/qa', label: 'Q&A Support', icon: QuestionMarkCircleIcon },
  ];

  return (
    <nav className="bg-gradient-to-r from-catholic-blue to-purple-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="bg-white p-2 rounded-lg">
              <span className="text-catholic-blue font-bold text-lg">✝️</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Catechist ChatCoach</h1>
              <p className="text-xs text-blue-200">Faithful AI Assistant for Religious Educators</p>
            </div>
          </div>

          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                    isActive
                      ? 'bg-white text-catholic-blue'
                      : 'hover:bg-blue-700 hover:bg-opacity-30'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden flex justify-around py-3 border-t border-blue-700">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center space-y-1 px-2 ${
                  isActive ? 'text-white' : 'text-blue-200'
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;