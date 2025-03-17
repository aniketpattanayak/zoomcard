import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BenefitsSection } from "@/components/benefits-section";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Coupon Banner */}
      <div className="bg-secondary text-white py-3 text-center">
        <p className="text-lg font-semibold">
          Use code <span className="bg-white text-secondary px-2 py-1 rounded mx-1">ABINASH10</span> 
          to get 10% off on your membership!
        </p>
      </div>

      <header className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Artist Membership Platform
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our professional community of creative artists and gain access to
            exclusive benefits and opportunities.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary">
              Register Now
            </Button>
          </Link>
        </div>
      </header>

      <BenefitsSection />
    </div>
  );
}