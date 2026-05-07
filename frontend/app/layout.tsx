import type { ReactNode } from "react";

export const metadata = {
  title: "FastAPI Admin UI",
  description: "Next.js frontend for FastAPI clean architecture backend",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif" }}>{children}</body>
    </html>
  );
}
