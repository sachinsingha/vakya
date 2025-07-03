import html2pdf from "html2pdf.js";

// Export as Markdown
export function exportAsMarkdown(session) {
  const markdown = session.messages
    .map((msg) => `### ${msg.role === "user" ? "You" : "AI"}\n${msg.content}`)
    .join("\n\n");
  const blob = new Blob([markdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);

  downloadFile(url, `${session.title}.md`);
}

// Export as TXT
export function exportAsTxt(session) {
  const text = session.messages
    .map((msg) => `${msg.role === "user" ? "You" : "AI"}: ${msg.content}`)
    .join("\n\n");
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  downloadFile(url, `${session.title}.txt`);
}

// Export as PDF
export function exportAsPDF(session) {
  const content = session.messages
    .map((msg) => `<h4>${msg.role === "user" ? "You" : "AI"}</h4><p>${msg.content}</p>`)
    .join("<hr>");
  const element = document.createElement("div");
  element.innerHTML = content;

  html2pdf().from(element).save(`${session.title}.pdf`);
}

function downloadFile(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
