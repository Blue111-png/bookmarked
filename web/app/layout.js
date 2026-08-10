import "./globals.css";

export const metadata = {
  title: "Bookmarked",
  description: "A shared board for resources worth revisiting",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
