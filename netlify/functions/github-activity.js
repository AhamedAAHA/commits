import { sendGitHubActivityResponse } from "../../server/githubActivity.js";

export async function handler(event) {
  const username = event.queryStringParameters?.username?.trim() || "AhamedAAHA";

  try {
    const body = await sendGitHubActivityResponse(username);

    return {
      statusCode: 200,
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };
  } catch {
    return {
      statusCode: 502,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        commits: [],
        error: "Unable to load GitHub activity.",
      }),
    };
  }
}
