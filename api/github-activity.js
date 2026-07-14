import { sendGitHubActivityResponse } from "../server/githubActivity.js";

export default async function handler(request, response) {
  const username =
    typeof request.query?.username === "string" && request.query.username.trim()
      ? request.query.username.trim()
      : "AhamedAAHA";

  try {
    const body = await sendGitHubActivityResponse(username);

    response.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    response.status(200).json(body);
  } catch (error) {
    response.status(error.status || 502).json({
      commits: [],
      error: "Unable to load GitHub activity.",
    });
  }
}
