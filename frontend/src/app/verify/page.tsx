import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, Globe, Brain } from "lucide-react";

interface VerifyPageProps {
  searchParams: Promise<{
    claim?: string;
  }>;
}

export default async function VerifyPage({
  searchParams,
}: VerifyPageProps) {
  const params = await searchParams;

  const claim =
    params.claim || "No claim was provided.";

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-5xl">

        <Badge className="mb-6">
          Verification Report
        </Badge>

        <h1 className="mb-8 text-5xl font-bold">
          AI Fact Verification
        </h1>

        <Card className="mb-6 rounded-2xl p-8">
          <h2 className="mb-2 text-lg font-semibold">
            Claim
          </h2>

          <p className="text-lg">
            {claim}
          </p>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">

          <Card className="rounded-2xl p-8">
            <div className="mb-4 flex items-center gap-3">
              <XCircle className="text-red-500" />
              <h3 className="text-2xl font-semibold">
                Verdict
              </h3>
            </div>

            <p className="text-3xl font-bold text-red-500">
              Mostly False
            </p>
          </Card>

          <Card className="rounded-2xl p-8">
            <div className="mb-4 flex items-center gap-3">
              <CheckCircle2 className="text-green-500" />
              <h3 className="text-2xl font-semibold">
                Confidence
              </h3>
            </div>

            <p className="text-3xl font-bold">
              96%
            </p>
          </Card>

        </div>

        <Card className="mt-6 rounded-2xl p-8">
          <div className="mb-4 flex items-center gap-3">
            <Brain />
            <h3 className="text-2xl font-semibold">
              AI Explanation
            </h3>
          </div>

          <p className="leading-8 text-muted-foreground">
            This is currently a mock verification result.
            In the next milestone, this explanation will come
            from the FastAPI backend and AI verification engine.
          </p>
        </Card>

        <Card className="mt-6 rounded-2xl p-8">
          <div className="mb-4 flex items-center gap-3">
            <Globe />
            <h3 className="text-2xl font-semibold">
              Sources
            </h3>
          </div>

          <ul className="space-y-2">
            <li>NASA</li>
            <li>European Space Agency</li>
            <li>Encyclopaedia Britannica</li>
          </ul>
        </Card>

      </div>
    </main>
  );
}