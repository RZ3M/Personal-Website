import { ThemeProvider } from "@/hooks/use-theme";
import { PortfolioApp } from "@/components/portfolio/PortfolioApp";

export default function Home() {
  return (
    <ThemeProvider>
      <PortfolioApp />
    </ThemeProvider>
  );
}
