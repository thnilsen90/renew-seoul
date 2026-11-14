import { Link } from "react-router";
import { Button, Tiger } from "@/lib/ui";
import { useTitle } from "@/lib/nav";

export function NotFound() {
  useTitle("Not found — Renew Seoul");
  return (
    <section className="container-x flex min-h-[80svh] flex-col items-center justify-center pt-24 text-center">
      <Tiger className="w-24 text-fire" />
      <h1 className="display mt-10 text-6xl md:text-8xl">
        Lost in <em>translation.</em>
      </h1>
      <p className="mt-5 max-w-sm text-slate">We couldn’t find that page. It may have moved — or never existed.</p>
      <Button as={Link} to="/" className="mt-10">
        Back to the shop
      </Button>
    </section>
  );
}
