import React from 'react';
import type { Category } from '../services/noteService';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategories: number[];
  onCategoryChange: (categoryIds: number[]) => void;
  disabled?: boolean;
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
 * Component for selecting multiple categories for a note
 */
export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategories,
  onCategoryChange,
  disabled = false,
}) => {
  const handleCategoryToggle = (categoryId: number) => {
    if (disabled) return;

    const newSelectedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];

    onCategoryChange(newSelectedCategories);
  };

  return (
    <div className="category-selector">
      <label>Categories:</label>
      <div className="category-checkboxes">
        {categories.map((category) => (
          <label key={category.id} className="category-checkbox">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category.id)}
              onChange={() => handleCategoryToggle(category.id)}
              disabled={disabled}
            />
            <span>{translateCategoryName(category.name)}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
