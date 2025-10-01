"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";

export type ViewMode = "board" | "table";

interface ViewTogglerProps {
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
}

export const ViewToggler: React.FC<ViewTogglerProps> = ({
  viewMode,
  onViewChange,
}) => {
  return (
    <div className="flex items-center border rounded-md overflow-hidden">
      <Button
        variant={viewMode === "board" ? "default" : "ghost"}
        size="sm"
        className={`rounded-none px-3 ${
          viewMode === "board" ? "bg-black text-white hover:bg-gray-800" : ""
        }`}
        onClick={() => onViewChange("board")}
      >
        <LayoutGrid className="h-4 w-4 mr-2" />
        Board
      </Button>
      <Button
        variant={viewMode === "table" ? "default" : "ghost"}
        size="sm"
        className={`rounded-none px-3 ${
          viewMode === "table" ? "bg-black text-white hover:bg-gray-800" : ""
        }`}
        onClick={() => onViewChange("table")}
      >
        <List className="h-4 w-4 mr-2" />
        Table
      </Button>
    </div>
  );
};
