/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow Android devices on the current development LAN to load Next's dev chunks.
  // Update this host if the development machine receives a different LAN address.
  allowedDevOrigins: ["10.215.72.141"],
  images: {
    qualities: [75, 85],
  },
};

export default nextConfig;
