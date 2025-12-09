import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  darkMode: boolean;
  items: FAQItem[];
}

export default function FAQ({ darkMode, items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-lg transition-colors`}>
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className={`w-6 h-6 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Frequently Asked Questions (FAQ)
        </h2>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className={`${darkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-gray-50 hover:bg-gray-100'} rounded-lg transition-colors overflow-hidden`}
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {item.question}
              </span>
              {openIndex === index ? (
                <ChevronUp className={`w-5 h-5 flex-shrink-0 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              ) : (
                <ChevronDown className={`w-5 h-5 flex-shrink-0 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              )}
            </button>

            {openIndex === index && (
              <div className={`px-6 pb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
