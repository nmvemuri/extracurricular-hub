// app/layout.js
// Wraps the entire app in the AuthProvider so any page can access user state.

import { AuthProvider } from "../lib/AuthContext";
import "./globals.css";

export const metadata = {
  title: "ExtracurricularHub",
  description: "Track activities. Discover opportunities. Build your future.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}