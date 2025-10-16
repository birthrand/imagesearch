import './styles/globals.css';

export const metadata = {
  title: 'ImageSearch Platform',
  description: 'Search curated imagery with secure APIs and modern tooling.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
