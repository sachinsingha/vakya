import html2pdf from "html2pdf.js";

export function exportChatAsPDF(session) {
  const container = document.createElement("div");
  container.style.padding = "20px";
  container.style.fontFamily = "Arial, sans-serif";
  container.style.fontSize = "14px";

  session.messages.forEach((msg) => {
    const role = msg.role === "user" ? "🧑 You" : "🤖 AI";
    const section = document.createElement("div");
    section.style.marginBottom = "16px";

    const title = document.createElement("strong");
    title.textContent = role;
    section.appendChild(title);

    const content = document.createElement("p");
    content.textContent = msg.content;
    section.appendChild(content);

    container.appendChild(section);
  });

  html2pdf()
    .from(container)
    .set({
      margin: 10,
      filename: `${session.title || "chat"}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .save();
}
