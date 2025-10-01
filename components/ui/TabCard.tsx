import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabItem {
  value: string;
  label: string;
  content: ReactNode;
}

interface TabCardProps {
  tabs: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function TabCard({
  tabs,
  defaultValue,
  value,
  onValueChange,
  className = "",
}: TabCardProps) {
  return (
    <div className={`bg-white rounded-md shadow-sm overflow-hidden ${className}`}>
      <Tabs
        defaultValue={defaultValue || tabs[0]?.value}
        value={value}
        onValueChange={onValueChange}
      >
        <TabsList className="w-full justify-start border-b rounded-none px-4">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-black data-[state=active]:text-white transition-colors"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
