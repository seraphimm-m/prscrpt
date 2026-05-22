import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { imageBase64, task, serialNumber, difficulty } = await request.json();
    
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const discordWebhook = process.env.DISCORD_WEBHOOK_URL;
    const weaverDiscordId = process.env.WEAVER_DISCORD_ID;

    // Build immediate prompt logic architecture
    const prompt = `You are the Weaver Computing Core from the game Library of Ruina. Examine this proof image to determine if the user completed this Prescript: "${task}". Respond strictly in a valid JSON scheme format with exactly two keys: "passed" (true or false) and "reason" (a brief narrative explanation in character).`;

    let aiResult = { passed: false, reason: "System network error parsing submission." };
    let apiSuccess = false;

    if (openRouterKey) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openRouterKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: model: "openrouter/free", 
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: prompt },
                  { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
                ]
              }
            ],
            response_format: { type: "json_object" }
          })
        });

        if (response.ok) {
          const data = await response.json();
          aiResult = JSON.parse(data.choices[0].message.content);
          apiSuccess = true;
        }
      } catch (err) {
        console.error("OpenRouter connection failure:", err);
      }
    }

    // Forwarding payload states straight to Discord Discord
    if (discordWebhook) {
      const payload = {
        content: (!apiSuccess || !aiResult.passed) ? `⚠️ **<@&${weaverDiscordId}> <@{${weaverDiscordId}}> THE CORE UNABLE TO AUTOMATICALLY CONFIRM COMPLIANCE. INTERVENE FOR SERIAL ${serialNumber}.**` : "",
        embeds: [{
          title: aiResult.passed ? `📜 Prescript Complied - ${serialNumber}` : `❌ Compliance Failure - ${serialNumber}`,
          color: aiResult.passed ? 6598134 : 16731469,
          fields: [
            { name: "Risk Rating", value: difficulty, inline: true },
            { name: "Command Line", value: task, inline: false },
            { name: "Evaluation Vector", value: aiResult.reason, inline: false }
          ],
          footer: { text: "The Index • Ink Spool Dynamic Web Engine" }
        }]
      };

      // Forward request details along to discord network
      await fetch(discordWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    return NextResponse.json({ success: aiResult.passed, feedback: aiResult.reason });

  } catch (error) {
    return NextResponse.json({ success: false, feedback: error.message }, { status: 500 });
  }
}