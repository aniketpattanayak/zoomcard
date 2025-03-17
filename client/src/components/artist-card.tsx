import { useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import { Card, CardContent } from "@/components/ui/card";
import type { Member } from "@shared/schema";

interface ArtistCardProps {
  member: Member;
  onCardGenerated?: (canvas: HTMLCanvasElement) => void;
}

export function ArtistCard({ member, onCardGenerated }: ArtistCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current && onCardGenerated) {
      html2canvas(cardRef.current).then(onCardGenerated);
    }
  }, [onCardGenerated]);

  return (
    <Card ref={cardRef} className="w-[400px] bg-white">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <img
            src={member.photoUrl}
            alt={member.name}
            className="w-32 h-32 rounded-lg object-cover"
          />
          <div>
            <h3 className="text-2xl font-bold">{member.name}</h3>
            <p className="text-muted-foreground mb-2">{member.category}</p>
            <p className="text-sm">Card No: {member.cardNumber}</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Blood Group:</span>
                <br />
                {member.bloodGroup}
              </div>
              <div>
                <span className="font-medium">Phone:</span>
                <br />
                {member.phone}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
