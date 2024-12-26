
import React, { useState } from "react";
import axios from "axios";
import DiffViewer from "react-diff-viewer";

const App = () => {
    const [html, setHtml] = useState("");
    const [updatedHtml, setUpdatedHtml] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const handleModernize = async () => {
        try {
            const response = await axios.post("http://localhost:3000/modernize", { html });
            setUpdatedHtml(response.data.updatedHtml);
            setSuggestions(response.data.suggestions);
        } catch (error) {
            console.error("Error modernizing HTML:", error);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>HTML Modernizer</h1>
            <textarea
                rows={10}
                cols={50}
                placeholder="Paste your HTML here"
                value={html}
                onChange={(e) => setHtml(e.target.value)}
            />
            <button onClick={handleModernize}>Modernize</button>
            <h2>Suggestions</h2>
            <ul>
                {suggestions.map((s, index) => (
                    <li key={index}>{s}</li>
                ))}
            </ul>
            <h2>HTML Diff</h2>
            <DiffViewer oldValue={html} newValue={updatedHtml} splitView={true} />
        </div>
    );
};

export default App;
