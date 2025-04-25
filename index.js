// svg用に使用するアセット辞書
const assetDict = {
  profileViews: "https://komarev.com/ghpvc/?username=0xfab0131",
  githubFollowers:
    "https://img.shields.io/github/followers/0xfab0131?style=flat&logo=github",
  welcomeGif: "https://media.giphy.com/media/hvRJCLFzcasrR4ia7z/giphy.gif",
  react:
    "https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black",
  nextjs:
    "https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white",
  typescript:
    "https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white",
  javascript:
    "https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black",
  threejs:
    "https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white",
  tailwind:
    "https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white",
  materialui:
    "https://img.shields.io/badge/Material_UI-007FFF?style=for-the-badge&logo=mui&logoColor=white",
  astro:
    "https://img.shields.io/badge/Astro-FF5D01?style=for-the-badge&logo=astro&logoColor=white",
  nodejs:
    "https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white",
  go: "https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white",
  python:
    "https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white",
  csharp:
    "https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=csharp&logoColor=white",
  dotnet:
    "https://img.shields.io/badge/.NET-512BD4?style=for-the-badge&logo=dotnet&logoColor=white",
  docker:
    "https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white",
  kubernetes:
    "https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white",
  graphql:
    "https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white",
  postgresql:
    "https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white",
  aws: "https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white",
  azure:
    "https://img.shields.io/badge/Azure-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white",
  gcp: "https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white",
  githubActions:
    "https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white",
  vercel:
    "https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white",
  firebase:
    "https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black",
  supabase:
    "https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white",
  cloudflare:
    "https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=cloudflare&logoColor=white",
  githubStats:
    "https://gtihub-readme-stats-fabmichelangelo-projects.vercel.app/api?username=0xfab0131&theme=vue-dark&count_private=true&include_all_commits=true&rank_icon=github&show_icons=true",
  topLanguages:
    "https://gtihub-readme-stats-fabmichelangelo-projects.vercel.app/api/top-langs/?username=0xfab0131&theme=vue-dark&count_private=true&show_icons=true&layout=compact&include_all_commits=true&rank_icon=github&size_weight=0.5&count_weight=0.5&langs_count=8&card_width=300&hide=html,css,php",
  streakStats:
    "https://github-readme-streak-stats-rust-eta.vercel.app/?user=0xfab0131&theme=vue-dark",
  twitter:
    "https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=x&logoColor=white",
  github:
    "https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white",
  profileViews: "https://komarev.com/ghpvc/?username=0xfab0131",
  githubFollowers:
    "https://img.shields.io/github/followers/0xfab0131?style=flat&logo=github",
  typescriptBadge:
    "https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white",
  reactBadge:
    "https://img.shields.io/badge/-React-45b8d8?style=flat-square&logo=react&logoColor=white",
  nextjsBadge:
    "https://img.shields.io/badge/-Next.js-000000?style=flat-square&logo=nextjs&logoColor=white",
  nodejsBadge:
    "https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=nodejs&logoColor=white",
  tailwindBadge:
    "https://img.shields.io/badge/-Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white",
  prismaBadge:
    "https://img.shields.io/badge/-Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white",
  githubStats:
    "https://gtihub-readme-stats-fabmichelangelo-projects.vercel.app/api?username=0xfab0131&theme=vue-dark&count_private=true&include_all_commits=true&rank_icon=github&show_icons=true",
  githubLangs:
    "https://gtihub-readme-stats-fabmichelangelo-projects.vercel.app/api/top-langs/?username=0xfab0131&theme=vue-dark&count_private=true&show_icons=true&layout=compact&include_all_commits=true&rank_icon=github&size_weight=0.5&count_weight=0.5&langs_count=8&card_width=300&hide=html,css,php",
  avatar: "https://avatars.githubusercontent.com/u/0xfab0131",
  githubProfile: "https://github.com/0xfab0131",
  twitterProfile: "https://twitter.com/fab_for_fab",
  linkedinProfile: "https://linkedin.com/in/0xfab0131",
};

// Check if running in Node.js environment for export
if (typeof module !== "undefined" && module.exports) {
  module.exports = { assetDict };
} else {
  // Browser environment functions (if index.html needs them directly,
  // but ideally only the build script uses assetDict)
  // Function to proxy an asset (browser context)
  function proxyAsset(assetKey) {
    if (!assetKey) return null;
    if (assetDict[assetKey]) {
      return assetDict[assetKey];
    }
    console.warn(`Asset key "${assetKey}" not found in dictionary`);
    return null;
  }

  // アセットをプロキシし、適切な形式で提供する関数 (browser context)
  async function serveAsset(assetKey, container) {
    const assetUrl = proxyAsset(assetKey);

    if (!assetUrl) {
      container.innerHTML = `<p>Asset key "${assetKey}" not found</p>`;
      return;
    }

    const getContentType = (url) => {
      if (url.endsWith(".svg")) return "image/svg+xml";
      if (url.endsWith(".gif")) return "image/gif";
      if (url.endsWith(".png")) return "image/png";
      if (url.endsWith(".jpg") || url.endsWith(".jpeg")) return "image/jpeg";
      return "application/octet-stream";
    };

    const contentType = getContentType(assetUrl);

    try {
      const response = await fetch(assetUrl);
      if (!response.ok)
        throw new Error(`Failed to fetch asset: ${response.status}`);

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      container.innerHTML = "";
      const img = document.createElement("img");
      img.src = blobUrl;
      img.style.maxWidth = "100%";
      container.appendChild(img);

      document.contentType = contentType;
    } catch (error) {
      console.error("Error fetching asset:", error);
      container.innerHTML = `<p>Error loading asset: ${error.message}</p>`;
    }
  }
}
