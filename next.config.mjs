// Project site: https://<user>.github.io/why-gta-vi
// For a user site or custom domain, set REPO to '' (and add public/CNAME).
const REPO = 'why-gta-vi';
const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd && REPO ? `/${REPO}` : '';

/** @type {import('next').NextConfig} */
export default {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};
