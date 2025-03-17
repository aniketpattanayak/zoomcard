import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { ArtistCard } from "@/components/artist-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Member } from "@shared/schema";
import html2canvas from "html2canvas";

export default function Success() {
  const { id } = useParams<{ id: string }>();

  const { data: member, isLoading } = useQuery<Member>({
    queryKey: [`/api/members/${id}`],
  });

  const downloadCard = (canvas: HTMLCanvasElement) => {
    const link = document.createElement("a");
    link.download = `membership-card-${member?.cardNumber}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!member) {
    return <div>Member not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-primary">
          Registration Successful!
        </h1>

        <div className="flex flex-col items-center gap-8">
          <ArtistCard member={member} onCardGenerated={downloadCard} />

          <div className="text-center">
            <p className="mb-4 text-muted-foreground">
              Your digital membership card has been generated.
              Click below to download it.
            </p>

            <Button
              onClick={() => {
                // This will trigger the onCardGenerated callback in ArtistCard
                const cardElement = document.querySelector(".card-container");
                if (cardElement) {
                  html2canvas(cardElement as HTMLElement).then(downloadCard);
                }
              }}
            >
              Download Membership Card
            </Button>

            <p className="mt-4 text-sm text-muted-foreground">
              Amount Paid: ₹{member.paymentAmount}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}