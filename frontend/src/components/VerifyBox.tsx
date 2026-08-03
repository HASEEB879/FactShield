import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function VerifyBox() {
  return (
    <div className="mx-auto mt-12 w-full max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-lg">
      <div className="flex flex-col gap-4 md:flex-row">
        <Input
          placeholder="Paste a claim, news article, URL, or statement..."
          className="h-12 text-base"
        />

        <Button className="h-12 px-8">
          <Search className="mr-2 h-4 w-4" />
          Verify
        </Button>
      </div>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Supports text, URLs, articles and social media posts.
      </p>
    </div>
  );
}