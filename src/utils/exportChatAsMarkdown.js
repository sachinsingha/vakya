export function exportChatAsMarkdown(session) {
  const lines = [];

  session.messages.forEach((msg) => {
    if (msg.role === "user") {
      lines.push(`## 🧑 You\n\n${msg.content}\n`);
    } else {
      lines.push(`## 🤖 AI\n\n${msg.content}\n`);
    }
  });

  const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${session.title || "chat"}.md`;
  a.click();

  URL.revokeObjectURL(url);
}
