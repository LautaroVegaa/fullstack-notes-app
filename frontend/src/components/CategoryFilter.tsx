import React from 'react';
import type { Category } from '../services/noteService';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
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
 * Component for filtering notes by category
 */
export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="category-filter">
      <label htmlFor="category-select">Filter by category:</label>
      <select
        id="category-select"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="category-select"
      >
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.name}>
            {translateCategoryName(category.name)}
          </option>
        ))}
      </select>
    </div>
  );
};
