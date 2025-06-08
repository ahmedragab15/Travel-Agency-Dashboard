import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { sentryReactRouter, type SentryReactRouterBuildOptions } from "@sentry/react-router";

const sentryConfig: SentryReactRouterBuildOptions = {
  org: "ahmed-ragab",
  project: "travel-agency-dashboard",
  // An auth token is required for uploading source maps.
  authToken: "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",
  // ...
};

export default defineConfig(config =>{
return {
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), sentryReactRouter(sentryConfig, config)],
  ssr: {
    noExternal: [/@syncfusion/],
  },
};
});
