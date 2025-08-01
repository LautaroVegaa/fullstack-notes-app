import React from 'react';
import type { Category } from '../services/noteService';

interface CategoryTagsProps {
  categories: Category[];
  onRemoveCategory?: (categoryId: number) => void;
  showRemoveButton?: boolean;
}

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
          {category.name}
          {showRemoveButton && onRemoveCategory && (
            <button
              onClick={() => onRemoveCategory(category.id)}
              className="remove-category-btn"
              title={`Quitar categoría ${category.name}`}
            >
              ×
            </button>
          )}
        </span>
      ))}
    </div>
  );
}; 