import type { Metadata } from 'next';
import '@/app/globals.css';

import StyledComponentsRegistry from '@/react-things/styled-components/registry';
import QueryProvider from '@/react-things/providers/QueryProvider';

import { getThemePreference } from '@/react-things/utils/theme';
import { ThemeProvider } from '@/react-things/providers/ThemeProvider';
import { baseFont } from '@/react-things/fonts';

export const metadata: Metadata = {
  title: 'Strega Alliance P5X',
  description: 'Nightmare Gateway data of Strega Alliance'
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
