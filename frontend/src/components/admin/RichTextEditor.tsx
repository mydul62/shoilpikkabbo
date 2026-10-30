"use client";

import * as React from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Unlink,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  Undo,
  Redo,
  Sparkles,
  Eye,
  FileCode,
  Check,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  label?: string;
  required?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write detailed product description, materials, specifications...",
  minHeight = "240px",
  label,
  required = false,
}: RichTextEditorProps) {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const [isHtmlMode, setIsHtmlMode] = React.useState(false);
  const [rawHtml, setRawHtml] = React.useState(value || "");
  const [activeFormats, setActiveFormats] = React.useState<Record<string, boolean>>({});

  // Synchronize incoming value with editor content
  React.useEffect(() => {
    if (editorRef.current && !isHtmlMode) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
    setRawHtml(value || "");
  }, [value, isHtmlMode]);

  // Handle visual editor input
  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setRawHtml(html);
      onChange(html);
      updateFormatState();
    }
  };

  // Handle raw HTML textarea change
  const handleRawHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const html = e.target.value;
    setRawHtml(html);
    onChange(html);
  };

  // Execute formatting command on selection
  const executeCommand = (command: string, value: string | undefined = undefined) => {
    if (isHtmlMode) return;
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    handleInput();
  };

  // Update active formatting states for toolbar highlighting
  const updateFormatState = () => {
    if (typeof document === "undefined") return;
    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      strikeThrough: document.queryCommandState("strikeThrough"),
      insertUnorderedList: document.queryCommandState("insertUnorderedList"),
      insertOrderedList: document.queryCommandState("insertOrderedList"),
    });
  };

  const handleLink = () => {
    if (isHtmlMode) return;
    const url = prompt("Enter URL (e.g. https://shoilpikkabbo.com):");
    if (url) {
      executeCommand("createLink", url);
    }
  };

  const handleHeading = (tag: "h2" | "h3" | "p") => {
    if (isHtmlMode) return;
    executeCommand("formatBlock", `<${tag}>`);
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
            <span>{label}</span>
            {required && <span className="text-rose-500">*</span>}
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsHtmlMode(!isHtmlMode)}
              className="text-[11px] font-semibold text-[#0D3B37] hover:text-[#E0592A] flex items-center gap-1 cursor-pointer transition-colors"
            >
              {isHtmlMode ? (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Visual Mode</span>
                </>
              ) : (
                <>
                  <FileCode className="w-3.5 h-3.5" />
                  <span>HTML Source</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="border border-brand-border rounded-2xl bg-white shadow-2xs overflow-hidden focus-within:border-[#0D3B37] focus-within:ring-2 focus-within:ring-[#0D3B37]/15 transition-all">
        {/* Editor Toolbar */}
        <div className="px-3 py-2 bg-[#FAF8F5] border-b border-sand flex items-center justify-between flex-wrap gap-1 select-none">
          <div className="flex items-center flex-wrap gap-0.5">
            {/* Heading Dropdown */}
            <select
              onChange={(e) => handleHeading(e.target.value as any)}
              disabled={isHtmlMode}
              className="text-xs px-2 py-1 rounded-lg border border-gray-200 bg-white font-medium text-gray-700 mr-1 cursor-pointer focus:outline-hidden disabled:opacity-40"
              defaultValue="p"
            >
              <option value="p">Normal Text</option>
              <option value="h2">Heading 2 (Large)</option>
              <option value="h3">Heading 3 (Medium)</option>
            </select>

            <span className="w-px h-4 bg-gray-300 mx-1" />

            {/* Bold */}
            <button
              type="button"
              onClick={() => executeCommand("bold")}
              disabled={isHtmlMode}
              className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeFormats.bold
                  ? "bg-[#0D3B37] text-white"
                  : "text-gray-700 hover:bg-black/5"
              } disabled:opacity-40`}
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>

            {/* Italic */}
            <button
              type="button"
              onClick={() => executeCommand("italic")}
              disabled={isHtmlMode}
              className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeFormats.italic
                  ? "bg-[#0D3B37] text-white"
                  : "text-gray-700 hover:bg-black/5"
              } disabled:opacity-40`}
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>

            {/* Underline */}
            <button
              type="button"
              onClick={() => executeCommand("underline")}
              disabled={isHtmlMode}
              className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeFormats.underline
                  ? "bg-[#0D3B37] text-white"
                  : "text-gray-700 hover:bg-black/5"
              } disabled:opacity-40`}
              title="Underline (Ctrl+U)"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>

            {/* Strikethrough */}
            <button
              type="button"
              onClick={() => executeCommand("strikeThrough")}
              disabled={isHtmlMode}
              className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeFormats.strikeThrough
                  ? "bg-[#0D3B37] text-white"
                  : "text-gray-700 hover:bg-black/5"
              } disabled:opacity-40`}
              title="Strikethrough"
            >
              <Strikethrough className="w-3.5 h-3.5" />
            </button>

            <span className="w-px h-4 bg-gray-300 mx-1" />

            {/* Bullet List */}
            <button
              type="button"
              onClick={() => executeCommand("insertUnorderedList")}
              disabled={isHtmlMode}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                activeFormats.insertUnorderedList
                  ? "bg-[#0D3B37] text-white"
                  : "text-gray-700 hover:bg-black/5"
              } disabled:opacity-40`}
              title="Bullet list"
            >
              <List className="w-3.5 h-3.5" />
            </button>

            {/* Numbered List */}
            <button
              type="button"
              onClick={() => executeCommand("insertOrderedList")}
              disabled={isHtmlMode}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                activeFormats.insertOrderedList
                  ? "bg-[#0D3B37] text-white"
                  : "text-gray-700 hover:bg-black/5"
              } disabled:opacity-40`}
              title="Numbered list"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>

            {/* Blockquote */}
            <button
              type="button"
              onClick={() => executeCommand("formatBlock", "<blockquote>")}
              disabled={isHtmlMode}
              className="p-1.5 rounded-lg text-xs text-gray-700 hover:bg-black/5 transition-colors cursor-pointer disabled:opacity-40"
              title="Quote block"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>

            <span className="w-px h-4 bg-gray-300 mx-1" />

            {/* Link */}
            <button
              type="button"
              onClick={handleLink}
              disabled={isHtmlMode}
              className="p-1.5 rounded-lg text-xs text-gray-700 hover:bg-black/5 transition-colors cursor-pointer disabled:opacity-40"
              title="Add Hyperlink"
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>

            {/* Unlink */}
            <button
              type="button"
              onClick={() => executeCommand("unlink")}
              disabled={isHtmlMode}
              className="p-1.5 rounded-lg text-xs text-gray-700 hover:bg-black/5 transition-colors cursor-pointer disabled:opacity-40"
              title="Remove Hyperlink"
            >
              <Unlink className="w-3.5 h-3.5" />
            </button>

            <span className="w-px h-4 bg-gray-300 mx-1" />

            {/* Alignments */}
            <button
              type="button"
              onClick={() => executeCommand("justifyLeft")}
              disabled={isHtmlMode}
              className="p-1.5 rounded-lg text-xs text-gray-700 hover:bg-black/5 transition-colors cursor-pointer disabled:opacity-40"
              title="Align Left"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand("justifyCenter")}
              disabled={isHtmlMode}
              className="p-1.5 rounded-lg text-xs text-gray-700 hover:bg-black/5 transition-colors cursor-pointer disabled:opacity-40"
              title="Align Center"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand("justifyRight")}
              disabled={isHtmlMode}
              className="p-1.5 rounded-lg text-xs text-gray-700 hover:bg-black/5 transition-colors cursor-pointer disabled:opacity-40"
              title="Align Right"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => executeCommand("undo")}
              disabled={isHtmlMode}
              className="p-1.5 rounded-lg text-xs text-gray-600 hover:bg-black/5 transition-colors cursor-pointer disabled:opacity-40"
              title="Undo"
            >
              <Undo className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand("redo")}
              disabled={isHtmlMode}
              className="p-1.5 rounded-lg text-xs text-gray-600 hover:bg-black/5 transition-colors cursor-pointer disabled:opacity-40"
              title="Redo"
            >
              <Redo className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Editor Body */}
        {isHtmlMode ? (
          <textarea
            value={rawHtml}
            onChange={handleRawHtmlChange}
            placeholder="Type or paste HTML code directly..."
            style={{ minHeight }}
            className="w-full p-4 font-mono text-xs text-gray-800 bg-[#FAF8F5] focus:outline-hidden resize-y leading-relaxed"
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onKeyUp={updateFormatState}
            onMouseUp={updateFormatState}
            style={{ minHeight }}
            className="w-full p-4 text-sm text-gray-800 focus:outline-hidden prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-[#0D3B37] prose-p:my-1.5 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-blockquote:border-l-4 prose-blockquote:border-[#E0592A] prose-blockquote:pl-3 prose-blockquote:italic"
            data-placeholder={placeholder}
          />
        )}

        {/* Footer info */}
        <div className="px-3 py-1.5 bg-[#FAF8F5] border-t border-sand text-[11px] text-gray-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#E0592A]" />
            <span>Rich Description (HTML & Formatting preserved)</span>
          </div>
          <span>
            {rawHtml.replace(/<[^>]+>/g, "").trim().length} characters
          </span>
        </div>
      </div>
    </div>
  );
}
