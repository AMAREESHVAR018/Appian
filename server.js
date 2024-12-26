
const express = require("express");
const cheerio = require("cheerio");
const axe = require("axe-core");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors()); // To allow frontend requests

/**
 * Analyze and modernize the uploaded HTML
 */
app.post("/modernize", async (req, res) => {
    const { html } = req.body;

    if (!html) {
        return res.status(400).json({ error: "No HTML provided" });
    }

    // Parse HTML using Cheerio
    const $ = cheerio.load(html);

    // Modernization Steps
    const suggestions = [];

    // 1. Apply Semantic Tags
    $("div.header").each((i, el) => {
        $(el).replaceWith(`<header>${$(el).html()}</header>`);
        suggestions.push("Replaced <div class='header'> with <header>.");
    });

    // 2. Add ARIA Roles for Accessibility
    $("img").each((i, el) => {
        if (!$(el).attr("alt")) {
            $(el).attr("alt", "Image description");
            suggestions.push("Added 'alt' attribute to <img> tags.");
        }
    });

    // 3. Apply Responsive Design (Example: Remove hardcoded widths)
    $("div").each((i, el) => {
        const style = $(el).attr("style");
        if (style && style.includes("width")) {
            $(el).attr("style", style.replace(/width:\s?\d+px;/, ""));
            suggestions.push("Removed hardcoded width in inline styles.");
        }
    });

    // Accessibility Check using Axe-core
    const axeResults = await axe.run($.root().html());
    suggestions.push(...axeResults.violations.map(v => v.description));

    res.json({
        updatedHtml: $.html(),
        suggestions,
    });
});

// Start the server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
