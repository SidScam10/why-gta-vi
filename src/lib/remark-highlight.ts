// Turns ==word== in article text into a <Hl> element (rendered in the accent colour used for ### headings).
// Only the markers are removed; the wording itself is untouched.
type Node = { type: string; value?: string; children?: Node[]; [k: string]: unknown };

const PATTERN = /==([^=\n]+)==/g;

function splitText(value: string): Node[] {
  const out: Node[] = [];
  let last = 0;
  for (const m of value.matchAll(PATTERN)) {
    const start = m.index ?? 0;
    if (start > last) out.push({ type: 'text', value: value.slice(last, start) });
    out.push({ type: 'mdxJsxTextElement', name: 'Hl', attributes: [], children: [{ type: 'text', value: m[1] }] });
    last = start + m[0].length;
  }
  if (last === 0) return [{ type: 'text', value }];
  if (last < value.length) out.push({ type: 'text', value: value.slice(last) });
  return out;
}

function walk(node: Node) {
  if (!node.children) return;
  if (node.type === 'code' || node.type === 'inlineCode') return;
  node.children = node.children.flatMap((child) => {
    if (child.type === 'text' && typeof child.value === 'string' && child.value.includes('==')) return splitText(child.value);
    walk(child);
    return [child];
  });
}

export default function remarkHighlight() {
  return (tree: Node) => walk(tree);
}
