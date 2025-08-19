// src/Admin/components/ui/separator.jsx

import React from "react";

export function Separator({ className = "" }) {
  return (
    <hr
      className={`border-t border-gray-200 dark:border-gray-700 ${className}`}
    />
  );
}
