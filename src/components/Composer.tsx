"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowUpIcon, LockIcon } from "./Icons";

const MAX_LENGTH = 500;

interface ComposerProps {
  onSubmit: (question: string) => void;
  disabled: boolean;
  autoFocus?: boolean;
}

export default function Composer({ onSubmit, disabled, autoFocus = false }: ComposerProps) {
  const [text, setText] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  const canSubmit = text.trim().length > 0 && !disabled;

  // o campo cresce com o texto, até um limite
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  }, [text]);

  function submit() {
    if (!canSubmit) return;
    onSubmit(text.trim());
    setText("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    // Enter envia; Shift+Enter quebra a linha
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      // borda mais clara + sombra suave; no foco, anel roxo
      className="rounded-card border border-line-strong bg-surface shadow-input transition-[border-color,box-shadow] duration-150 focus-within:border-brand/60 focus-within:shadow-[var(--sh-focus),var(--sh-input)]"
    >
      <label htmlFor="question" className="sr-only">
        Sua pergunta
      </label>
      <textarea
        id="question"
        ref={ref}
        rows={1}
        autoFocus={autoFocus}
        maxLength={MAX_LENGTH}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escreva sua pergunta em português"
        className="block max-h-48 w-full resize-none bg-transparent px-4 pb-2 pt-4 text-base leading-6 text-ink placeholder:text-muted focus:outline-none"
      />
      <div className="flex items-center justify-between pb-2 pl-4 pr-2">
        <span className="flex items-center gap-2">
          <span className="badge" title="O sistema só consulta os dados. Ele nunca altera, apaga nem cria nada.">
            <LockIcon className="size-4" />
            Só consulta, não altera dados
          </span>
          {text.length > MAX_LENGTH * 0.9 && (
            <span className="text-xs text-danger-ink">
              {text.length}/{MAX_LENGTH}
            </span>
          )}
        </span>
        {/* cinza com o campo vazio; com texto, cor de destaque e hover */}
        <button
          type="submit"
          disabled={!canSubmit}
          aria-label="Enviar pergunta"
          className="press inline-flex size-10 items-center justify-center rounded-pill bg-brand text-on-accent hover:brightness-110 disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-muted disabled:hover:brightness-100"
        >
          <ArrowUpIcon className="size-5" />
        </button>
      </div>
    </form>
  );
}
