import { Hono } from "https://deno.land/x/hono@v3.11.7/mod.ts";
import { cors } from "https://deno.land/x/hono@v4.1.1/middleware.ts";
// import { getSuggestion } from "./services/getSuggestion.js";

const app = new Hono();

app.use("/api/*", cors());

app.post("/api/completion", async (c) => {
  const { text } = await c.req.json()
  console.log(text);

  // const suggestedSentence = await getSuggestion(text);

  //response from cloud function https://worker-floral-silence-5eb8.tres.workers.dev/
  // return new Response(JSON.stringify({
  //   "predictions": [
  //     {
  //       "text": responseText.response,
  //     }
  //   ]
  // }));

  const suggestedSentence = await fetch("https://worker-floral-silence-5eb8.tres.workers.dev/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  }).then((res) => res.json()).then((res) => res.predictions[0].text);


  return c.json({
    "predictions": [
      {
        "text": suggestedSentence,
      }
    ]
  });
});

Deno.serve(app.fetch);
