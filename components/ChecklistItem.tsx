
import React from 'react';
// FIX: Changed ChecklistItemType to ChecklistItem to match the exported type.
import { ChecklistItem } from '../types';

interface ChecklistItemProps {
  item: ChecklistItem;
  onToggle: () => void;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({ item, onToggle }) => {
  return (
    <label className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
      <input
        type="checkbox"
        checked={item.completed}
        onChange={onToggle}
        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <span className={`text-gray-700 ${item.completed ? 'line-through text-gray-400' : ''}`}>
        {item.text}
      </span>
    </label>
  );
};

export default ChecklistItem;
