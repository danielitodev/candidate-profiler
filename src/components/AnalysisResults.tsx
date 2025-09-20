import React from 'react';
import { User, Mail, Phone, Briefcase, Code, RotateCcw, TrendingUp, AlertTriangle, CheckCircle, Target } from 'lucide-react';

interface ExtractedData {
  name: string;
  email: string;
  phone: string;
  work_history: string[];
  skills: string[];
}

interface AnalysisResult {
  extracted_data: ExtractedData;
  ai_analysis: string;
}

interface AnalysisResultsProps {
  results: AnalysisResult;
  onReset: () => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results, onReset }) => {
  const { extracted_data, ai_analysis } = results;

  // Parse AI analysis to extract structured information
  const parseAnalysis = (analysis: string) => {
    const sections = {
      score: '',
      breakdown: '',
      strengths: [] as string[],
      weaknesses: [] as string[],
      keywords: [] as string[],
      consistency: ''
    };

    const lines = analysis.split('\n');
    let currentSection = '';

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.includes('OVERALL_SCORE')) {
        currentSection = 'score';
        sections.score = trimmed.split(':')[1]?.trim() || '';
      } else if (trimmed.includes('SCORE_BREAKDOWN')) {
        currentSection = 'breakdown';
        sections.breakdown = trimmed.split(':')[1]?.trim() || '';
      } else if (trimmed.includes('STRENGTHS')) {
        currentSection = 'strengths';
      } else if (trimmed.includes('WEAKNESSES')) {
        currentSection = 'weaknesses';
      } else if (trimmed.includes('KEYWORD_SUGGESTIONS')) {
        currentSection = 'keywords';
      } else if (trimmed.includes('CONSISTENCY_CHECK')) {
        currentSection = 'consistency';
        sections.consistency = trimmed.split(':')[1]?.trim() || '';
      } else if (trimmed && currentSection) {
        if (currentSection === 'strengths' && trimmed.match(/^\d+\./)) {
          sections.strengths.push(trimmed.replace(/^\d+\.\s*/, ''));
        } else if (currentSection === 'weaknesses' && trimmed.match(/^\d+\./)) {
          sections.weaknesses.push(trimmed.replace(/^\d+\.\s*/, ''));
        } else if (currentSection === 'keywords' && trimmed.match(/^\d+\./)) {
          sections.keywords.push(trimmed.replace(/^\d+\.\s*/, ''));
        }
      }
    });

    return sections;
  };

  const analysisData = parseAnalysis(ai_analysis);

  return (
    <div className="space-y-8">
      {/* Header with Reset Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
        <button
          onClick={onReset}
          className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Analyze Another CV
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Extracted Information */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Personal Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <User className="w-4 h-4 text-gray-500 mr-3" />
                <span className="font-medium text-gray-900">{extracted_data.name}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-gray-500 mr-3" />
                <span className="text-gray-700">{extracted_data.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-gray-500 mr-3" />
                <span className="text-gray-700">{extracted_data.phone}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
              Work History
            </h3>
            <div className="space-y-2">
              {extracted_data.work_history.length > 0 ? (
                extracted_data.work_history.map((item, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{item}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No work history found</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Code className="w-5 h-5 mr-2 text-blue-600" />
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {extracted_data.skills.length > 0 ? (
                extracted_data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 italic">No skills identified</p>
              )}
            </div>
          </div>
        </div>

        {/* AI Analysis */}
        <div className="space-y-6">
          {/* Overall Score */}
          {analysisData.score && (
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Overall Score
              </h3>
              <div className="text-3xl font-bold">{analysisData.score}</div>
              {analysisData.breakdown && (
                <p className="text-blue-100 mt-2">{analysisData.breakdown}</p>
              )}
            </div>
          )}

          {/* Strengths */}
          {analysisData.strengths.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Strengths
              </h3>
              <ul className="space-y-2">
                {analysisData.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Areas for Improvement */}
          {analysisData.weaknesses.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                Areas for Improvement
              </h3>
              <ul className="space-y-2">
                {analysisData.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Keyword Suggestions */}
          {analysisData.keywords.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-purple-600" />
                Recommended Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysisData.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Consistency Check */}
          {analysisData.consistency && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Consistency Check
              </h3>
              <p className="text-gray-700">{analysisData.consistency}</p>
            </div>
          )}

          {/* Raw AI Analysis (fallback) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Detailed Analysis
            </h3>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
                {ai_analysis}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;