import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BenefitsSection } from "@/components/benefits-section";

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <img
              src="./favicon.png" // Update with the correct path to your logo
              alt="Zoom Cards Logo"
              className="w-28" // Adjust size and spacing as needed
            />
            <h1 className="text-4xl md:text-6xl font-bold">
              ZOOM CARDS
            </h1>
          </div>
          <p className="text-xl mb-8 text-gray-400 max-w-2xl mx-auto">
            Join our professional community, Zoom Card Association, registered under the MSME Certification for creative artists, and gain access to exclusive benefits and opportunities. Zoom Card artists receive regular work on a monthly basis. Since 2018, 5,000+ members have registered with the Zoom Card Association, making it one of the most trusted associations in India.
          </p>
          <Link href="/applynow">
            <Button size="lg" variant="secondary">
              Apply Now
            </Button>
          </Link>
          {/* About Zoom Cards Section */}
      <section className="py-20 ">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">About Zoom Cards</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Zoom Card Organization (ZCO) is a leading voice for the Indian film industry, supporting cine and television artists. As a charitable body, ZCO offers beneficial services, workshops, and networking opportunities to 5,000+ members. Led by an elected executive committee, we uphold integrity, professionalism, and community support. Our programs include acting and theatre workshops, fostering career growth. We also organize events to enhance networking, knowledge, and skills. Dedicated to members' welfare, ZCO continuously strives to improve services, creating a strong, supportive environment in the entertainment industry.
          </p>
        </div>
      </section>
        </div>
      </header>

      

      <BenefitsSection />
    </div>
  );
}
