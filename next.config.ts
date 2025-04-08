import type { NextConfig } from "next";


/** @type {import('next').NextConfig} */
const nextConfig : NextConfig= {
  eslint :{
    ignoreDuringBuilds : true
  },
  images: {
    domains: ["lh3.googleusercontent.com", "avatars.githubusercontent.com" ]
     
  },
};

module.exports = nextConfig;
