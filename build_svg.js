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
    if (!url || !url.startsWith("https://")) {
      console.warn(`Skipping invalid or non-HTTPS URL: ${url}`);
      return resolve(""); // Resolve with empty string for invalid URLs
    }

    https
      .get(
        url,
        { headers: { "User-Agent": "Node.js-Build-Script/1.0" } }, // Added basic UA
        (response) => {
          // Handle redirects explicitly
          if (
            response.statusCode >= 300 &&
            response.statusCode < 400 &&
            response.headers.location
          ) {
            console.log(
              `Redirect detected for ${url}. Following to ${response.headers.location}`
            );
            // Recursively call fetchImageAsDataUri with the new location
            return fetchImageAsDataUri(response.headers.location)
              .then(resolve)
              .catch(reject);
          }

          // Check for successful status code after handling redirects
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
              let responseContentType = response.headers["content-type"];
              let finalContentType;

              // *** START: Content-Type Correction Logic ***
              if (
                responseContentType &&
                responseContentType.toLowerCase().includes("svg")
              ) {
                // If the content type explicitly mentions SVG, use image/svg+xml
                finalContentType = "image/svg+xml";
                console.log(
                  `Detected SVG content type for ${url}. Using ${finalContentType}.`
                );
              } else if (
                responseContentType &&
                responseContentType.toLowerCase().includes("gif")
              ) {
                // Explicitly handle GIF content type
                finalContentType = "image/gif";
                console.log(
                  `Detected GIF content type for ${url}. Using ${finalContentType}.`
                );
              } else {
                // Otherwise, use the detected content type or fallback to png
                finalContentType = responseContentType || "image/png";
                console.log(
                  `Using content type ${finalContentType} for ${url}.`
                );
              }
              // *** END: Content-Type Correction Logic ***

              let base64;
              // Handle binary data correctly
              if (
                finalContentType.includes("image/") &&
                !finalContentType.includes("svg")
              ) {
                // For binary images (gif, png, jpg, etc.), directly convert buffer to base64
                base64 = buffer.toString("base64");
                console.log(`Processed binary image data for ${url}`);
              } else {
                // For SVG and other text-based formats, use UTF-8 conversion
                const utf8String = buffer.toString("utf-8");
                base64 = Buffer.from(utf8String, "utf-8").toString("base64");
                console.log(`Processed text-based data for ${url}`);
              }

              resolve(`data:${finalContentType};base64,${base64}`);
            } catch (e) {
              reject(
                new Error(`Error processing data for ${url}: ${e.message}`)
              );
            }
          });
        }
      )
      .on("error", (err) => {
        // More specific error for network issues vs. processing issues
        reject(new Error(`Network error fetching ${url}: ${err.message}`));
      });
  });
}

// Function to escape special characters for regex
function escapeRegExp(string) {
  // Handle potential null or undefined input
  if (typeof string !== "string") return "";
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

async function buildSvg() {
  try {
    let templateContent = await fs.readFile(templatePath, "utf8");

    const fetchPromises = [];
    const placeholderData = {}; // Stores results: { placeholder: dataUriOrOriginalUrl }

    console.log("Starting image fetching and conversion...");

    for (const placeholder in placeholderMap) {
      const assetKey = placeholderMap[placeholder];
      const url = assetDict[assetKey];

      if (url) {
        console.log(`Processing placeholder: ${placeholder} for URL: ${url}`);
        // Create a promise for each fetch operation
        const promise = fetchImageAsDataUri(url)
          .then((dataUri) => {
            if (dataUri) {
              // Only store if fetch was successful
              placeholderData[placeholder] = dataUri;
              console.log(
                `Successfully fetched and converted ${url} for ${placeholder}`
              );
            } else {
              console.warn(
                `Received empty data URI for ${placeholder}, likely skipped or failed fetch.`
              );
              placeholderData[placeholder] = ""; // Ensure placeholder exists even on failure
            }
          })
          .catch((error) => {
            console.error(
              `Failed processing asset for ${placeholder} (${url}): ${error.message}`
            );
            placeholderData[placeholder] = ""; // Use empty string on error to avoid breaking replacement
          });
        fetchPromises.push(promise);
      } else {
        console.warn(
          `No URL found for asset key: ${assetKey} (placeholder: ${placeholder}). Skipping.`
        );
        placeholderData[placeholder] = ""; // Assign empty string if no URL
      }
    }

    // Wait for all image fetch/conversion promises to settle
    console.log(
      `Waiting for ${fetchPromises.length} fetch operations to complete...`
    );
    await Promise.allSettled(fetchPromises); // Use allSettled to continue even if some fetches fail
    console.log("All fetch operations settled.");

    // Replace placeholders with the results stored in placeholderData
    console.log("Replacing placeholders in template...");
    for (const placeholder in placeholderData) {
      if (placeholderMap.hasOwnProperty(placeholder)) {
        // Ensure it's a placeholder we intended to replace
        const dataValue = placeholderData[placeholder];
        // Escape the placeholder for use in RegExp
        const escapedPlaceholder = escapeRegExp(placeholder);
        if (escapedPlaceholder) {
          // Only replace if placeholder is valid
          const regex = new RegExp(escapedPlaceholder, "g");
          templateContent = templateContent.replace(regex, dataValue);
          console.log(`Replaced ${placeholder}`);
        } else {
          console.warn(
            `Skipped replacement for invalid placeholder: ${placeholder}`
          );
        }
      }
    }
    console.log("Placeholder replacement complete.");

    // Write the modified content to the output file
    await fs.writeFile(outputPath, templateContent, "utf8");
    console.log(
      `✅ Successfully built ${outputPath} with embedded or linked assets.`
    );
  } catch (error) {
    console.error("❌ Error building SVG:", error);
    process.exit(1); // エラーが発生した場合は終了コード1で終了
  }
}

// ビルド関数を実行
buildSvg();
