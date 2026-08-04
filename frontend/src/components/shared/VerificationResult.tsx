import { CheckCircle, AlertTriangle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { VerifyResponse } from "@/types/api";

interface Props {
  result: VerifyResponse;
}

export default function VerificationResult({ result }: Props) {
  const verified = result.verdict === "Mock Result" || result.verdict === "Verified";

  return (
    <Card className="mx-auto mt-8 max-w-3xl rounded-2xl p-6 shadow-lg">

      <div className="flex items-center gap-3">

        {verified ? (
          <CheckCircle className="h-8 w-8 text-green-600" />
        ) : (
          <AlertTriangle className="h-8 w-8 text-red-600" />
        )}

        <div>

          <h2 className="text-2xl font-bold">
            {result.verdict}
          </h2>

          <Badge
            className={
              verified
                ? "mt-2 bg-green-600"
                : "mt-2 bg-red-600"
            }
          >
            {result.confidence}% Confidence
          </Badge>

        </div>

      </div>

      <div className="mt-6">

        <h3 className="font-semibold text-lg">
          Explanation
        </h3>

        <p className="mt-2 text-muted-foreground">
          {result.explanation}
        </p>

      </div>

      <div className="mt-8">

        <h3 className="font-semibold text-lg">
          Trusted Sources
        </h3>

        <ul className="mt-3 space-y-2">

          {result.sources.map((source) => (
            <li
              key={source}
              className="rounded-lg border p-3"
            >
              ✓ {source}
            </li>
          ))}

        </ul>

      </div>

    </Card>
  );
}