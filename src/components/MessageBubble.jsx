export function MessageBubble({ role, content }) {
  const isUser = role === "user";
  return (
    <div className={`p-3 rounded-lg my-2 max-w-[80%] ${isUser ? "ml-auto bg-blue-600 text-white" : "mr-auto bg-gray-700 text-white"}`}>
      <p className="whitespace-pre-wrap">{content}</p>
    </div>
  );
}
