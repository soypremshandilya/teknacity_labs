import { type ReactNode } from "react";

import Header from "@/components/navigation/Header";
import Footer from "@/components/layout/Footer";

type LayoutProps = {
  children?: ReactNode;
};

/**
 * Root layout: owns page-level structure (header, main, footer regions).
 */
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-bg text-fg">
      <Header />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}
