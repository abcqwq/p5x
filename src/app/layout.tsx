import type { Metadata } from 'next';
import '@/app/globals.css';

import StyledComponentsRegistry from '@/styled-components/registry';
import QueryProvider from '@/providers/QueryProvider';

import { getThemePreference } from '@/utils/theme';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { baseFont } from '@/fonts';

export const metadata: Metadata = {
  title: 'qwq next starter',
  description:
    'A starter template for Next.js with TypeScript, Styled-Components, and React Query.'
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, colors] = await getThemePreference();

  return (
    <html lang="en" style={colors as React.CSSProperties}>
      <body className={baseFont.className}>
        <StyledComponentsRegistry>
          <QueryProvider>
            <ThemeProvider initialTheme={theme}>{children}</ThemeProvider>
          </QueryProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
