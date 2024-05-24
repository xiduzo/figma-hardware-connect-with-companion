/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  async headers() {
    const heads = [];

    if (process.env.ALLOWED_ORIGIN) {
      heads.push({
        key: "Access-Control-Allow-Origin",
        value: process.env.ALLOWED_ORIGIN,
      });
    } else {
      throw new Error("ALLOWED_ORIGIN is not set");
    }

    if (process.env.ALLOWED_METHODS) {
      heads.push({
        key: "Access-Control-Allow-Methods",
        value: process.env.ALLOWED_METHODS,
      });
    } else {
      throw new Error("ALLOWED_METHODS is not set");
    }

    if (process.env.ALLOWED_HEADERS) {
      heads.push({
        key: "Access-Control-Allow-Headers",
        value: process.env.ALLOWED_HEADERS,
      });
    } else {
      throw new Error("ALLOWED_HEADERS is not set");
    }

    return [
      {
        // Routes this applies to
        source: "/api/(.*)",
        headers: heads,
      },
    ];
  },
};

export default config;
