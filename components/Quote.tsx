export default function Quote({ text, source }: { text: string; source?: string }) {
  return (
    <blockquote className="border-l-2 border-line pl-3 text-[13.5px] leading-relaxed text-stone-600">
      <span className="italic">&ldquo;{text}&rdquo;</span>
      {source && <span className="ml-1.5 text-xs not-italic text-muted">— {source}</span>}
    </blockquote>
  );
}
