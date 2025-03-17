import { Card, CardContent } from "@/components/ui/card";
import { artistCategories } from "../../../server/models/schema";
import { CATEGORY_ICONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface CategoryGridProps {
  selected?: string;
  onSelect: (category: string) => void;
}

export function CategoryGrid({ selected, onSelect }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {artistCategories.map((category) => (
        <Card
          key={category}
          className={cn(
            "cursor-pointer transition-all hover:scale-105",
            selected === category && "ring-2 ring-primary"
          )}
          onClick={() => onSelect(category)}
        >
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-2">{CATEGORY_ICONS[category]}</div>
            <h3 className="font-medium">{category}</h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
