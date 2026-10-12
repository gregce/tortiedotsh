export const TORTIE_REPOSITORY_URL = "https://github.com/gregce/tortie";
export const TORTIE_MACOS_DOWNLOAD_URL = `${TORTIE_REPOSITORY_URL}/releases/latest/download/Tortie-arm64.dmg`;
// Tortie for iPhone's public TestFlight beta. vercel.json redirects /iphone to
// the TestFlight link (307, so it can move), and every page links here rather
// than to TestFlight itself, so the link changes in one place.
export const TORTIE_IPHONE_URL = "https://tortie.sh/iphone";
