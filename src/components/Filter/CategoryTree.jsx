import React, { memo } from "react";
import { Checkbox } from "antd";

const CategoryTreeItem = memo(
  ({
    categories,
    category,
    selectedCategories,
    onCategoryChange,
    level = 0,
  }) => {
    const childCategories = categories.filter(
      (cat) => cat.parent === category._id
    );

    return (
      <div key={category._id}>
        <div style={{ marginLeft: `${level * 24}px` }}>
          <Checkbox
            value={category._id}
            checked={selectedCategories.includes(category._id)}
            onChange={(e) => onCategoryChange(category._id, e.target.checked)}
            className="text-gray-700"
          >
            {category.name}
          </Checkbox>
        </div>
        {childCategories.length > 0 && (
          <div className="mt-2">
            {childCategories.map((child) => (
              <CategoryTreeItem
                key={child._id}
                categories={categories}
                category={child}
                selectedCategories={selectedCategories}
                onCategoryChange={onCategoryChange}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

const CategoryTree = memo(
  ({ categories, selectedCategories, onCategoryChange }) => {
    const rootCategories = categories.filter((cat) => !cat.parent);

    return (
      <div className="max-h-[500px] overflow-y-auto pr-2">
        {rootCategories.map((category) => (
          <CategoryTreeItem
            key={category._id}
            categories={categories}
            category={category}
            selectedCategories={selectedCategories}
            onCategoryChange={onCategoryChange}
            level={0}
          />
        ))}
      </div>
    );
  }
);

export default CategoryTree;
