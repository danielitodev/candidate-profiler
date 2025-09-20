import React from 'react';
import { Brain, FileText, Zap } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className="animate-spin">
            <Brain className="w-8 h-8 text-blue-600" />
          </div>
          <div className="animate-pulse">
            <FileText className="w-8 h-8 text-purple-600" />
          </div>
          <div className="animate-bounce">
            <Zap className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Analyzing Your Resume
        </h3>
        <p className="text-gray-600 mb-6">
          Our AI is carefully reviewing your CV and generating insights...
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Extracting information</span>
            <span className="text-green-600 font-medium">✓ Complete</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">AI analysis in progress</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Generating recommendations</span>
            <span className="text-gray-400">Pending</span>
          </div>
        </div>
        
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            This usually takes 10-30 seconds depending on the complexity of your resume.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;