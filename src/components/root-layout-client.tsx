"use client";

import { useEffect } from "react";
import { initMixpanel } from "@/lib/mixpanelClient";

interface RootLayoutClientProps {
  children: React.ReactNode;
}

export function RootLayoutClient({ children }: RootLayoutClientProps) {
  useEffect(() => {
    initMixpanel(); // Initialize Mixpanel
  }, []);

  return <>{children}</>;
}
