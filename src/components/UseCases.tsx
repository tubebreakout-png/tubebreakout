import { CheckCircle, Star } from 'lucide-react';

interface UseCase {
  title: string;
  description: string;
  result: string;
}

interface UseCasesProps {
  darkMode: boolean;
  cases: UseCase[];
}

export default function UseCases({ darkMode, cases }: UseCasesProps) {
  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-lg transition-colors`}>
      <div className="flex items-center gap-2 mb-6">
        <Star className={`w-6 h-6 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Successful Use Cases
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {cases.map((useCase, index) => (
          <div
            key={index}
            className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6 transition-colors`}
          >
            <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {useCase.title}
            </h3>
            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {useCase.description}
            </p>
            <div className={`flex items-start gap-2 ${darkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200'} border rounded-lg p-3`}>
              <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
                  Result:
                </p>
                <p className={`text-sm ${darkMode ? 'text-green-200' : 'text-green-700'}`}>
                  {useCase.result}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
