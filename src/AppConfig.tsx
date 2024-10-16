import {
  QueryClientProvider,
  // useQueryClient,
  QueryClient,
} from "@tanstack/react-query";
import vkBridge, {
  parseURLSearchParamsForGetLaunchParams,
} from "@vkontakte/vk-bridge";
import {
  useAdaptivity,
  useAppearance,
  useInsets,
} from "@vkontakte/vk-bridge-react";
import {
  AdaptivityProvider,
  ConfigProvider,
  AppRoot,
} from "@vkontakte/vkui";
import { RouterProvider } from "@vkontakte/vk-mini-apps-router";
import "@vkontakte/vkui/dist/vkui.css";

import { transformVKBridgeAdaptivity } from "./utils";
import { router } from "./routes";
import { App } from "./App";
import { CookiesProvider } from "react-cookie";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 5000,
      staleTime: 30000,
    },
  },
});

export const AppConfig = () => {
  const vkBridgeAppearance = useAppearance() || undefined;
  const vkBridgeInsets = useInsets() || undefined;
  const adaptivity = transformVKBridgeAdaptivity(
    useAdaptivity()
  );
  const { vk_platform } = parseURLSearchParamsForGetLaunchParams(
    window.location.search
  );

  return (
    <ConfigProvider
      appearance={vkBridgeAppearance}
      platform={
        vk_platform === "desktop_web" ? "vkcom" : undefined
      }
      isWebView={vkBridge.isWebView()}
      hasCustomPanelHeaderAfter={true}
    >
      <AdaptivityProvider {...adaptivity}>
        <AppRoot mode="full" safeAreaInsets={vkBridgeInsets}>
          <CookiesProvider>
            <QueryClientProvider client={queryClient}>
              <RouterProvider router={router}>
                <App />
              </RouterProvider>
            </QueryClientProvider>
          </CookiesProvider>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
};
