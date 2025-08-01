import React from 'react';
import type { Category } from '../services/noteService';

interface CategoryTagsProps {
  categories: Category[];
  onRemoveCategory?: (categoryId: number) => void;
  showRemoveButton?: boolean;
}

/**
 * Translates category names from Spanish to English for display purposes
 */
const translateCategoryName = (name: string): string => {
  const translations: Record<string, string> = {
    'Trabajo': 'Work',
    'Personal': 'Personal',
    'Urgente': 'Urgent',
    'Ideas': 'Ideas',
    'Recordatorios': 'Reminders',
    'Proyectos': 'Projects',
    'Estudio': 'Study',
    'Finanzas': 'Finance',
    'Salud': 'Health',
  };
  return translations[name] || name;
};

/**
 * Component for displaying category tags on a note
 */
export const CategoryTags: React.FC<CategoryTagsProps> = ({
  categories,
  onRemoveCategory,
  showRemoveButton = false,
}) => {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="category-tags">
      {categories.map((category) => (
        <span key={category.id} className="category-tag">
          {translateCategoryName(category.name)}
          {showRemoveButton && onRemoveCategory && (
            <button
              onClick={() => onRemoveCategory(category.id)}
              className="remove-category-btn"
              title={`Remove category ${translateCategoryName(category.name)}`}
            >
              ×
            </button>
          )}
        </span>
      ))}
    </div>
  );
};
