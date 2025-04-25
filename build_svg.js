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

// GitHubステータス系の特別なプレースホルダー
const githubStatsPlaceholders = [
  "{{GITHUB_STATS_URL}}",
  "{{TOP_LANGUAGES_URL}}",
  "{{STREAK_STATS_URL}}",
];

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

// Function to fetch SVG content and return as string
function fetchSvgContent(url) {
  return new Promise((resolve, reject) => {
    if (!url || !url.startsWith("https://")) {
      console.warn(`Skipping invalid or non-HTTPS URL: ${url}`);
      return resolve(""); // Resolve with empty string for invalid URLs
    }

    https
      .get(
        url,
        { headers: { "User-Agent": "Node.js-Build-Script/1.0" } },
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
            // Recursively call fetchSvgContent with the new location
            return fetchSvgContent(response.headers.location)
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
              const svgContent = buffer.toString("utf-8");

              // 取得したSVGからscriptタグを除去（セキュリティ対策）
              const sanitizedSvg = svgContent.replace(
                /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
                ""
              );

              // 完全なSVGを返す（内部コンテンツだけではなく）
              resolve(sanitizedSvg);
            } catch (e) {
              reject(
                new Error(`Error processing SVG data for ${url}: ${e.message}`)
              );
            }
          });
        }
      )
      .on("error", (err) => {
        reject(new Error(`Network error fetching ${url}: ${err.message}`));
      });
  });
}

// --- NEW: Function to fetch Google Fonts CSS ---
function fetchGoogleFontCss(url) {
  return new Promise((resolve, reject) => {
    // Send request with User-Agent that prefers WOFF2
    https
      .get(
        url,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
          },
        },
        (response) => {
          if (response.statusCode < 200 || response.statusCode >= 300) {
            return reject(
              new Error(
                `Failed to fetch CSS ${url}: Status Code ${response.statusCode}`
              )
            );
          }
          let css = "";
          response.on("data", (chunk) => (css += chunk));
          response.on("end", () => resolve(css));
        }
      )
      .on("error", (err) =>
        reject(new Error(`Network error fetching CSS ${url}: ${err.message}`))
      );
  });
}

// --- NEW: Function to parse CSS and extract WOFF2 URLs & font details ---
function parseCssForFonts(css) {
  const fonts = [];
  // Regex to capture @font-face blocks and extract details
  const fontFaceRegex = /@font-face\s*{([^}]*)}/g;
  const propertyRegex = /([a-zA-Z-]+)\s*:\s*([^;]+);/g;
  const urlRegex = /url\((https:\/\/fonts\.gstatic\.com\/[^\)]+\.woff2)\)/;

  let match;
  while ((match = fontFaceRegex.exec(css)) !== null) {
    const block = match[1];
    const details = {
      family: null,
      style: "normal",
      weight: "400",
      woff2Url: null,
    };
    let propMatch;
    while ((propMatch = propertyRegex.exec(block)) !== null) {
      const [, property, value] = propMatch;
      if (property === "font-family") {
        details.family = value.replace(/['\"]/g, ""); // Remove quotes
      } else if (property === "font-style") {
        details.style = value;
      } else if (property === "font-weight") {
        details.weight = value;
      } else if (property === "src") {
        const urlMatch = value.match(urlRegex);
        if (urlMatch) {
          details.woff2Url = urlMatch[1];
        }
      }
    }
    if (details.family && details.woff2Url) {
      fonts.push(details);
    }
  }
  return fonts;
}

// --- NEW: Function to fetch font file and convert to Data URI ---
function fetchFontAsDataUri(url) {
  return new Promise((resolve, reject) => {
    if (!url || !url.startsWith("https://")) {
      console.warn(`Skipping invalid or non-HTTPS font URL: ${url}`);
      return resolve(""); // Resolve with empty string for invalid URLs
    }

    https
      .get(
        url,
        { headers: { "User-Agent": "Node.js-Build-Script/1.0" } },
        (response) => {
          // Handle redirects
          if (
            response.statusCode >= 300 &&
            response.statusCode < 400 &&
            response.headers.location
          ) {
            console.log(
              `Redirect detected for font ${url}. Following to ${response.headers.location}`
            );
            return fetchFontAsDataUri(response.headers.location)
              .then(resolve)
              .catch(reject);
          }
          if (response.statusCode < 200 || response.statusCode >= 300) {
            return reject(
              new Error(
                `Failed to fetch font ${url}: Status Code ${response.statusCode}`
              )
            );
          }

          const chunks = [];
          response.on("data", (chunk) => chunks.push(chunk));
          response.on("end", () => {
            try {
              const buffer = Buffer.concat(chunks);
              const base64 = buffer.toString("base64");
              resolve(`data:font/woff2;base64,${base64}`); // Assume WOFF2 for now
            } catch (e) {
              reject(
                new Error(`Error processing font data for ${url}: ${e.message}`)
              );
            }
          });
        }
      )
      .on("error", (err) =>
        reject(new Error(`Network error fetching font ${url}: ${err.message}`))
      );
  });
}

async function buildSvg() {
  try {
    let templateContent = await fs.readFile(templatePath, "utf8");

    // --- UPDATED: Fetch and embed multiple fonts ---
    let allFontFaceRules = "";
    // Request both fonts in one go
    const fontsCssUrl =
      "https://fonts.googleapis.com/css2?family=Honk&family=Oleo+Script:wght@400;700&display=swap";
    try {
      console.log("Fetching combined font CSS...");
      const fontCss = await fetchGoogleFontCss(fontsCssUrl);
      console.log("Parsing CSS for font details...");
      const fontsToEmbed = parseCssForFonts(fontCss);

      if (fontsToEmbed.length > 0) {
        console.log(`Found ${fontsToEmbed.length} font variations to embed.`);
        const fontPromises = fontsToEmbed.map(async (fontInfo) => {
          try {
            console.log(
              `Fetching ${fontInfo.family} (${fontInfo.weight}) WOFF2 from ${fontInfo.woff2Url}`
            );
            const fontDataUri = await fetchFontAsDataUri(fontInfo.woff2Url);
            if (fontDataUri) {
              // Generate the @font-face rule for this specific font variation
              return `
    @font-face {
      font-family: '${fontInfo.family}';
      font-style: ${fontInfo.style};
      font-weight: ${fontInfo.weight};
      font-display: swap;
      src: url(${fontDataUri}) format('woff2');
    }`;
            } else {
              console.warn(
                `Failed to get Data URI for ${fontInfo.family} (${fontInfo.weight}).`
              );
              return null;
            }
          } catch (fontError) {
            console.error(
              `Error processing font ${fontInfo.family} (${fontInfo.weight}): ${fontError.message}`
            );
            return null;
          }
        });

        const results = await Promise.allSettled(fontPromises);
        results.forEach((result) => {
          if (result.status === "fulfilled" && result.value) {
            allFontFaceRules += result.value;
          }
        });

        if (allFontFaceRules) {
          console.log("Successfully prepared all required @font-face rules.");
        } else {
          console.warn("Could not generate any @font-face rules.");
        }
      } else {
        console.warn(
          "Could not find any valid font definitions in Google Fonts CSS."
        );
      }
    } catch (error) {
      console.error(`Error processing fonts: ${error.message}`);
      // Continue build without custom fonts if fetching fails
    }
    // --- END: Fetch and embed multiple fonts ---

    const fetchPromises = [];
    const placeholderData = {}; // Stores results: { placeholder: dataUriOrOriginalUrl }

    console.log("Starting image fetching and conversion...");

    for (const placeholder in placeholderMap) {
      const assetKey = placeholderMap[placeholder];
      const url = assetDict[assetKey];

      if (url) {
        console.log(`Processing placeholder: ${placeholder} for URL: ${url}`);

        // GitHubステータス系SVGは直接SVGコンテンツを取得
        if (githubStatsPlaceholders.includes(placeholder)) {
          const promise = fetchSvgContent(url)
            .then((svgContent) => {
              if (svgContent) {
                placeholderData[placeholder] = svgContent;
                console.log(
                  `Successfully fetched and processed SVG content for ${placeholder}`
                );
              } else {
                console.warn(
                  `Received empty SVG content for ${placeholder}, likely skipped or failed fetch.`
                );
                placeholderData[placeholder] = ""; // Ensure placeholder exists even on failure
              }
            })
            .catch((error) => {
              console.error(
                `Failed processing SVG content for ${placeholder} (${url}): ${error.message}`
              );
              placeholderData[placeholder] = ""; // Use empty string on error to avoid breaking replacement
            });
          fetchPromises.push(promise);
        } else {
          // 通常のアセットはData URIとして処理
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
        }
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

          // GitHubステータス系SVGは img タグを置き換える
          if (githubStatsPlaceholders.includes(placeholder)) {
            // まずは対応するimg要素のIDを特定
            let imgId = "";
            if (placeholder === "{{GITHUB_STATS_URL}}")
              imgId = "github-stats-img";
            else if (placeholder === "{{TOP_LANGUAGES_URL}}")
              imgId = "top-langs-img";
            else if (placeholder === "{{STREAK_STATS_URL}}")
              imgId = "streak-stats-img";

            // img要素を対応するSVG要素に置き換える正規表現パターン
            const imgPattern = new RegExp(`<img id="${imgId}"[^>]*>`, "g");

            if (dataValue) {
              // SVGタグの属性を修正してIDやクラスを追加
              const modifiedSvg = dataValue.replace(
                /<svg/i,
                `<svg id="${imgId}" class="stats-card"`
              );

              // 置換を実行
              templateContent = templateContent.replace(
                imgPattern,
                modifiedSvg
              );
              console.log(`Replaced ${imgId} with full SVG content`);
            } else {
              console.warn(
                `No SVG content available for ${imgId}, skipping replacement`
              );
            }
          } else {
            // 通常のプレースホルダー置換（Data URI）
            templateContent = templateContent.replace(regex, dataValue);
            console.log(`Replaced ${placeholder}`);
          }
        } else {
          console.warn(
            `Skipped replacement for invalid placeholder: ${placeholder}`
          );
        }
      }
    }
    console.log("Placeholder replacement complete.");

    // --- UPDATED: Inject all @font-face rules into <style> ---
    if (allFontFaceRules) {
      const styleTagStart = '<style type="text/css"><![CDATA[';
      const styleTagIndex = templateContent.indexOf(styleTagStart);
      if (styleTagIndex !== -1) {
        const insertionPoint = styleTagIndex + styleTagStart.length;
        // Inject all rules at the beginning of the style block
        templateContent =
          templateContent.slice(0, insertionPoint) +
          "\n" +
          allFontFaceRules +
          "\n" +
          templateContent.slice(insertionPoint);
        console.log("Injected all @font-face rules into <style> tag.");
      } else {
        console.warn(
          "Could not find <style> tag start to inject @font-face rules."
        );
      }
    }
    // --- END: Inject all @font-face rules ---

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
