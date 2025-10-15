import React, { useState } from 'react';
import type { RecipeVariant } from '../types';
import '../styles/variantsList.css';

interface VariantsListProps {
  variants: RecipeVariant[];
  className?: string;
}

const VariantsList: React.FC<VariantsListProps> = ({ variants, className = '' }) => {
  const [expandedVariant, setExpandedVariant] = useState<number | null>(null);

  const toggleVariant = (index: number) => {
    setExpandedVariant(expandedVariant === index ? null : index);
  };

  if (variants.length === 0) {
    return (
      <div className={`${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recipe Variants</h3>
        <div className="text-center py-8 text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="icon-2xl text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-sm">No variants available for this recipe.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recipe Variants</h3>
      <div className="space-y-4">
        {variants.map((variant, index) => (
          <div key={variant.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleVariant(index)}
              className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center"
            >
              <div>
                <h4 className="font-medium text-gray-900">{variant.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{variant.description}</p>
              </div>
              <svg
                className={`icon-md text-gray-400 transition-transform ${
                  expandedVariant === index ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {expandedVariant === index && (
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="space-y-4">
                  {/* Modified Ingredients */}
                  {variant.modifications.ingredients.length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                        <svg className="icon-sm mr-2 text-primary-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Modified Ingredients
                      </h5>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        {variant.modifications.ingredients.map((ingredient, idx) => (
                          <li key={idx}>{ingredient}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Modified Instructions */}
                  {variant.modifications.instructions.length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                        <svg className="icon-sm mr-2 text-primary-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Modified Instructions
                      </h5>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                        {variant.modifications.instructions.map((instruction, idx) => (
                          <li key={idx}>{instruction}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* No modifications message */}
                  {variant.modifications.ingredients.length === 0 && variant.modifications.instructions.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-sm">This variant uses the same ingredients and instructions as the original recipe.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VariantsList;