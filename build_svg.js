const fs = require("fs").promises;
const path = require("path");
const { assetDict } = require("./index.js"); // index.jsからassetDictをインポート
// テンプレートファイルと出力ファイルのパス
const templatePath = path.join(dirname, "assets", "interactive_template.svg");
const outputPath = path.join(dirname, "assets", "interactive.svg");
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
async function buildSvg() {
  try {
    // テンプレートファイルを読み込む
    let templateContent = await fs.readFile(templatePath, "utf8");
    // プレースホルダーを実際のURLで置き換える
    for (const placeholder in placeholderMap) {
      const assetKey = placeholderMap[placeholder];
      const url = assetDict[assetKey] || ""; // 見つからない場合は空文字
      // 正規表現でプレースホルダーを全て置換 (gフラグ)
      const regex = new RegExp(
        placeholder.replace(/[-\/\\^$+?.()|[\]{}]/g, "\\$&"),
        "g"
      );
      templateContent = templateContent.replace(regex, url);
    }
    // 完成したSVGを出力ファイルに書き込む
    await fs.writeFile(outputPath, templateContent, "utf8");
    console.log(`Successfully built ${outputPath}`);
  } catch (error) {
    console.error("Error building SVG:", error);
    process.exit(1); // エラーが発生した場合は終了コード1で終了
  }
}
// ビルド関数を実行
buildSvg();
