"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TurndownService from "turndown";

type RichTextEditorProps = {
  onChange: (markdown: string) => void;
  value: string;
};

type ToolbarButtonProps = {
  active?: boolean;
  children: React.ReactNode;
  label: string;
  onClick: () => void;
};

function markdownFromHtml(html: string): string {
  const service = new TurndownService({ bulletListMarker: "-", codeBlockStyle: "fenced" });

  // Markdown has no native underline syntax. Keep the author intent in a small,
  // harmless convention that the public renderer can recognize later.
  service.addRule("underline", {
    filter: "u",
    replacement(content) {
      return `++${content}++`;
    },
  });

  return service.turndown(html).trim();
}

function htmlFromMarkdown(markdown: string): string {
  if (!markdown.trim()) return "<p></p>";
  const blocks = normalizeLineEndings(markdown).trim().split(/\n{2,}/);
  return blocks.map((block) => {
    const lines = block.split("\n");
    const firstLine = lines[0] ?? "";
    const secondLine = lines[1] ?? "";
    if (/^=+\s*$/u.test(secondLine)) return `<h2>${inlineMarkdownToHtml(firstLine)}</h2>`;
    if (/^-+\s*$/u.test(secondLine)) return `<h2>${inlineMarkdownToHtml(firstLine)}</h2>`;
    if (firstLine.startsWith("### ")) return `<h3>${inlineMarkdownToHtml(firstLine.slice(4))}</h3>`;
    if (firstLine.startsWith("## ")) return `<h2>${inlineMarkdownToHtml(firstLine.slice(3))}</h2>`;
    if (lines.every((line) => line.startsWith("- "))) return `<ul>${lines.map((line) => `<li>${inlineMarkdownToHtml(line.slice(2))}</li>`).join("")}</ul>`;
    return `<p>${inlineMarkdownToHtml(block).replace(/\n/gu, "<br>")}</p>`;
  }).join("");
}

function normalizeLineEndings(value: string): string {
  return value.replace(/\r\n?/gu, "\n");
}

function inlineMarkdownToHtml(value: string): string {
  return escapeHtml(value)
    .replace(/\*\*([^*]+)\*\*/gu, "<strong>$1</strong>")
    .replace(/\+\+([^+]+)\+\+/gu, "<u>$1</u>")
    .replace(/\*([^*]+)\*/gu, "<em>$1</em>")
    .replace(/_([^_]+)_/gu, "<em>$1</em>");
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"]/gu, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character] ?? character);
}

function ToolbarButton({ active = false, children, label, onClick }: ToolbarButtonProps) {
  return (
    <button
      aria-label={label}
      aria-pressed={active}
      className="editorial-richtext-button"
      type="button"
      onClick={onClick}
      onMouseDown={(event) => event.preventDefault()}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ onChange, value }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] }, underline: false }), Underline],
    content: htmlFromMarkdown(value),
    editorProps: {
      attributes: {
        "aria-label": "Article body",
        class: "editorial-richtext-content",
        role: "textbox",
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor: updatedEditor }) => onChange(markdownFromHtml(updatedEditor.getHTML())),
  });

  if (!editor) {
    return <div className="editorial-richtext-loading">Loading the writing tools…</div>;
  }

  return (
    <section className="editorial-richtext" aria-label="Article body editor">
      <div className="editorial-richtext-toolbar" role="toolbar" aria-label="Text formatting">
        <ToolbarButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><strong>B</strong></ToolbarButton>
        <ToolbarButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em></ToolbarButton>
        <ToolbarButton label="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></ToolbarButton>
        <span className="editorial-richtext-divider" aria-hidden="true" />
        <ToolbarButton label="Section heading" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>Heading</ToolbarButton>
        <ToolbarButton label="Small heading" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>Subheading</ToolbarButton>
        <ToolbarButton label="Bulleted list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>Bullets</ToolbarButton>
        <ToolbarButton label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>Numbers</ToolbarButton>
        <ToolbarButton label="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>Quote</ToolbarButton>
        <ToolbarButton label="Code block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>Code</ToolbarButton>
        <span className="editorial-richtext-divider" aria-hidden="true" />
        <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()}>Undo</ToolbarButton>
        <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()}>Redo</ToolbarButton>
      </div>
      <EditorContent editor={editor} />
      <p className="editorial-richtext-help">Write as you would in a document. Use <strong>Heading</strong> to start a new section—the article title above is already the main page headline.</p>
      <details className="editorial-richtext-markdown">
        <summary>Advanced: view the Markdown that will be saved</summary>
        <pre>{value || "Start writing to see the saved Markdown."}</pre>
      </details>
      <textarea aria-hidden="true" className="editorial-richtext-value" name="body" readOnly tabIndex={-1} value={value} />
    </section>
  );
}
