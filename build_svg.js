const fs = require("fs").promises;
const path = require("path");
const https = require("https"); // Use https for fetching
const { assetDict } = require("./index.js"); // index.jsからassetDictをインポート
// テンプレートファイルと出力ファイルのパス
const templatePath = path.join(__dirname, "assets", "interactive_template.svg");
const outputPath = path.join(__dirname, "assets", "interactive.svg");
// プレースホルダーとassetDictのキーのマッピング
// (必要に応じて調整してください。プレースホルダー名をキーに合わせます)
const placeholderMap = {
  "{{PROFILE_VIEWS_URL}}": "profileViews",
  "{{GITHUB_FOLLOWERS_URL}}": "githubFollowers",
  "{{WELCOME_GIF_URL}}": "welcomeGif",
  "{{REACT_URL}}": "react",
  "{{NEXTJS_URL}}": "nextjs",
  "{{TYPESCRIPT_URL}}": "typescript",
  "{{JAVASCRIPT_URL}}": "javascript",
  "{{THREEJS_URL}}": "threejs",
  "{{TAILWIND_URL}}": "tailwind",
  "{{MATERIALUI_URL}}": "materialui",
  "{{ASTRO_URL}}": "astro",
  "{{NODEJS_URL}}": "nodejs",
  "{{GO_URL}}": "go",
  "{{PYTHON_URL}}": "python",
  "{{CSHARP_URL}}": "csharp",
  "{{DOTNET_URL}}": "dotnet",
  "{{DOCKER_URL}}": "docker",
  "{{KUBERNETES_URL}}": "kubernetes",
  "{{GRAPHQL_URL}}": "graphql",
  "{{POSTGRESQL_URL}}": "postgresql",
  "{{AWS_URL}}": "aws",
  "{{AZURE_URL}}": "azure",
  "{{GCP_URL}}": "gcp",
  "{{GITHUB_ACTIONS_URL}}": "githubActions",
  "{{VERCEL_URL}}": "vercel",
  "{{FIREBASE_URL}}": "firebase",
  "{{SUPABASE_URL}}": "supabase",
  "{{CLOUDFLARE_URL}}": "cloudflare",
  "{{GITHUB_STATS_URL}}": "githubStats",
  "{{TOP_LANGUAGES_URL}}": "topLanguages",
  "{{STREAK_STATS_URL}}": "streakStats",
  "{{TWITTER_URL}}": "twitter",
  "{{GITHUB_URL}}": "github",
};

// Function to fetch an image and convert it to Data URI
function fetchImageAsDataUri(url) {
  return new Promise((resolve, reject) => {
    // Basic check for valid URL structure (can be improved)
    if (!url || !url.startsWith("https://")) {
      console.warn(`Skipping invalid or non-HTTPS URL: ${url}`);
      // Resolve with an empty string or a placeholder if needed
      return resolve("");
    }

    https
      .get(
        url,
        { headers: { "User-Agent": "Node.js-Build-Script" } },
        (response) => {
          if (response.statusCode < 200 || response.statusCode >= 300) {
            return reject(
              new Error(
                `Failed to fetch ${url}: Status Code ${response.statusCode}`
              )
            );
          }

          const chunks = [];
          response.on("data", (chunk) => {
            chunks.push(chunk);
          });

          response.on("end", () => {
            try {
              const buffer = Buffer.concat(chunks);
              const contentType =
                response.headers["content-type"] || "image/png"; // Default or guess
              const base64 = buffer.toString("base64");
              resolve(`data:${contentType};base64,${base64}`);
            } catch (e) {
              reject(
                new Error(`Error processing data for ${url}: ${e.message}`)
              );
            }
          });
        }
      )
      .on("error", (err) => {
        reject(new Error(`Error fetching ${url}: ${err.message}`));
      });
  });
}

// Function to escape special characters for regex
function escapeRegExp(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

async function buildSvg() {
  try {
    let templateContent = await fs.readFile(templatePath, "utf8");

    // Create promises for all image fetches
    const fetchPromises = [];
    const placeholderData = {};

    for (const placeholder in placeholderMap) {
      const assetKey = placeholderMap[placeholder];
      const url = assetDict[assetKey];
      if (url) {
        // Only fetch if URL exists
        // Fetch image and store promise
        const promise = fetchImageAsDataUri(url)
          .then((dataUri) => {
            placeholderData[placeholder] = dataUri; // Store fetched data URI
          })
          .catch((error) => {
            console.error(
              `Failed to fetch asset for ${placeholder}: ${error.message}`
            );
            placeholderData[placeholder] = ""; // Use empty string on error
          });
        fetchPromises.push(promise);
      }
    }

    // Wait for all images to be fetched and converted
    await Promise.all(fetchPromises);

    // Replace placeholders with fetched Data URIs
    for (const placeholder in placeholderData) {
      const dataUri = placeholderData[placeholder];
      const regex = new RegExp(escapeRegExp(placeholder), "g");
      templateContent = templateContent.replace(regex, dataUri);
    }

    await fs.writeFile(outputPath, templateContent, "utf8");
    console.log(`Successfully built ${outputPath} with embedded images.`);
  } catch (error) {
    console.error("Error building SVG:", error);
    process.exit(1); // エラーが発生した場合は終了コード1で終了
  }
}

// ビルド関数を実行
buildSvg();
