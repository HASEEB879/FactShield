import { Search, Brain, Globe, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import Container from "@/components/shared/Container";
import SectionTitle from "@/components/shared/SectionTitle";

const steps = [
  {
    icon: Search,
    title: "1. Enter a Claim",
    description:
      "Paste a statement, article, news headline, or website URL that you want to verify.",
  },
  {
    icon: Brain,
    title: "2. AI Analysis",
    description:
      "Our AI examines the claim, identifies key facts, and prepares it for verification.",
  },
  {
    icon: Globe,
    title: "3. Cross-Check Sources",
    description:
      "Information is compared against reliable and trusted public sources.",
  },
  {
    icon: ShieldCheck,
    title: "4. View Results",
    description:
      "Receive a confidence score, explanation, and supporting evidence.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <Container>
        <SectionTitle
          badge="How It Works"
          title="Verify Any Claim in Four Simple Steps"
          description="Fast, transparent, and designed to help you make informed decisions."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <Card
                key={step.title}
                className="rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-5 flex justify-center">
                  <Icon className="h-10 w-10 text-primary" />
                </div>

                <h3 className="mb-3 text-lg font-semibold">
                  {step.title}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}