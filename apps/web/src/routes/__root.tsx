import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
  useRouteContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { createServerFn } from "@tanstack/react-start";
import { ConvexProvider } from "@/app/providers/convex-provider";
import { QueryProvider } from "@/app/providers/query-provider";
import appCss from "@/app/styles/index.css?url";
import type { RouterAppContext } from "@/app/types/router-app-context";
import { getToken } from "@/shared/config/auth-server";
import { Toaster } from "@/components/ui/sonner";

const getAuth = createServerFn({ method: "GET" }).handler(async () => {
  return await getToken();
});

// Re-export for other routes that may need it
export type { RouterAppContext } from "@/app/types/router-app-context";

export const Route = createRootRouteWithContext<RouterAppContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Plutus - Personal Finance",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        href: "/favicon-16x16.png",
        rel: "icon",
        sizes: "16x16",
        type: "image/png",
      },
      {
        href: "/favicon-32x32.png",
        rel: "icon",
        sizes: "32x32",
        type: "image/png",
      },
      { href: "/favicon.ico", rel: "shortcut icon" },
      {
        href: "/apple-touch-icon.png",
        rel: "apple-touch-icon",
        sizes: "180x180",
      },
      {
        href: "/favicon.ico",
        rel: "icon",
      },
    ],
  }),

  component: RootDocument,
  beforeLoad: async (ctx) => {
    const token = await getAuth();
    if (token) {
      ctx.context.convexQueryClient.serverHttpClient?.setAuth(token);
    }
    return {
      isAuthenticated: !!token,
      token,
    };
  },
});

function RootDocument() {
  const context = useRouteContext({ from: Route.id });

  return (
    <ConvexProvider
      client={context.convexQueryClient.convexClient}
      initialToken={context.token ?? null}
    >
      <QueryProvider client={context.queryClient}>
        <html lang="en">
          <head>
            <HeadContent />
          </head>
          <body>
            <Outlet />
            <Toaster richColors />
            <TanStackRouterDevtools position="bottom-left" />
            <Scripts />
          </body>
        </html>
      </QueryProvider>
    </ConvexProvider>
  );
}
