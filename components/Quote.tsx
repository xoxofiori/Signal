export default function Quote({ text, source }: { text: string; source?: string }) {
  return (
    <blockquote className="border-l-2 border-[#e2c9a8] pl-3 text-[13.5px] leading-relaxed text-[#5f574b]">
      <span className="italic">&ldquo;{text}&rdquo;</span>
      {source && <span className="ml-1.5 text-xs not-italic text-muted">— {source}</span>}
    </blockquote>
  );
}
