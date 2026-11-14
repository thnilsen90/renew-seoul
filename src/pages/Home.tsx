import { useEffect } from "react";
import { useLocation } from "react-router";
import { Hero } from "@/components/Hero";
import { RoutineExplorer } from "@/components/RoutineExplorer";
import { Shop } from "@/components/Shop";
import { TenToThree } from "@/components/TenToThree";
import { RoutineBuilder } from "@/components/RoutineBuilder";
import { BrandMarquee, BrandStory } from "@/components/BrandStory";
import { Journal } from "@/components/Journal";
import { AssuranceStrip } from "@/components/Assurance";
import { useTitle } from "@/lib/nav";

export function Home() {
  useTitle("Renew Seoul — Korean skincare, simplified");
  const { hash, key } = useLocation();

  // Arriving from another page with /#section: jump there once the sections exist.
  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start" }));
  }, [hash, key]);

  return (
    <>
      <Hero />
      <TenToThree />
      <RoutineExplorer />
      <Shop />
      <RoutineBuilder />
      <AssuranceStrip />
      <BrandMarquee />
      <BrandStory />
      <Journal />
    </>
  );
}
