import "@mantine/core/styles.css";
import "@copilotkit/react-ui/styles.css";
import "./globals.css";

import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from "@mantine/core";
import { theme } from "../../theme";
import { CopilotKit } from "@copilotkit/react-core";

export const metadata = {
  title: "Mantine Next.js template",
  description: "I am using Mantine with Next.js!",
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <CopilotKit runtimeUrl="/api/copilotkit" agent="sample_agent">
            {children}
          </CopilotKit>
        </MantineProvider>
      </body>
    </html>
  );
}
