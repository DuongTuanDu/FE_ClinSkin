import React, { memo } from "react";
import { Tag, theme } from "antd";

const TagFilter = memo(({ tags = [], selectedTags = [], onTagClick }) => {
  const { token } = theme.useToken();

  return (
    <div className="flex flex-wrap gap-2">
      {tags?.map((tag) => (
        <Tag
          key={tag}
          className="cursor-pointer px-3 py-1.5 text-sm"
          color={selectedTags?.includes(tag) ? "blue" : "default"}
          style={{
            borderRadius: token.borderRadius,
          }}
          onClick={() => onTagClick(tag)}
        >
          {tag}
        </Tag>
      ))}
    </div>
  );
});

export default TagFilter;
