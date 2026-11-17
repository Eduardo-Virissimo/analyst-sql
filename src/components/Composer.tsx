"use client";

// O campo de pergunta: um cartão com o texto em cima e, embaixo, o aviso "só consulta" e o botão de enviar.
// Enter envia; Shift+Enter quebra a linha. O campo cresce com o texto, até um limite.
// Com `hints`, o campo vazio mostra perguntas de exemplo que se trocam a cada poucos segundos.
// Com `working`, uma luz percorre a borda enquanto o agente pensa.
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowUpIcon, LockIcon } from "./Icons";

const MAX_LENGTH = 500;

interface ComposerProps {
  onSubmit: (question: string) => void;
  disabled: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  /** perguntas de exemplo que se revezam no campo vazio */
  hints?: string[];
  /** true enquanto o agente responde */
  working?: boolean;
}

export default function Composer({
  onSubmit,
  disabled,
  autoFocus = false,
  placeholder = "Pergunte qualquer coisa sobre os dados de RH",
  hints,
  working = false,
}: ComposerProps) {
  const [text, setText] = useState("");
  const [hintIndex, setHintIndex] = useState(0);

  // troca a pergunta de exemplo a cada 4 s (parado com "reduzir movimento")
  useEffect(() => {
    if (!hints?.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setHintIndex((i) => (i + 1) % hints.length), 4000);
    return () => clearInterval(id);
  }, [hints]);
  const hint = hints?.length && !text ? hints[hintIndex] : null;
  const ref = useRef<HTMLTextAreaElement>(null);
  const canSubmit = text.trim().length > 0 && !disabled;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [text]);

  function submit() {
    if (!canSubmit) return;
    onSubmit(text.trim());
    setText("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
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
      onClick={() => ref.current?.focus()}
      className={`relative cursor-text rounded-card border shadow-input transition-[border-color,box-shadow] duration-150 ${working ? "composer-live" : "border-line-strong bg-surface focus-within:border-brand/60 focus-within:shadow-[var(--sh-focus),var(--sh-input)]"}`}
    >
      <label htmlFor="question" className="sr-only">
        Sua pergunta
      </label>
      <textarea
        id="question"
        aria-label={hint ? `Sua pergunta (exemplo: ${hint})` : undefined}
        ref={ref}
        rows={1}
        autoFocus={autoFocus}
        maxLength={MAX_LENGTH}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={hint ? "" : placeholder}
        className="scrollbar block min-h-14 w-full resize-none bg-transparent px-4 pb-2 pt-4 text-base leading-6 text-ink placeholder:text-faint focus:outline-none"
      />
      {hint && (
        <span
          key={hint}
          aria-hidden="true"
          className="hint pointer-events-none absolute left-4 right-16 top-4 truncate text-base leading-6 text-faint"
        >
          {hint}
        </span>
      )}
      <div className="flex items-center justify-between gap-4 pb-2 pl-4 pr-2">
        <span
          className="flex items-center gap-2 text-xs text-faint"
          title="O assistente só consulta os dados. Ele nunca altera, apaga nem cria nada."
        >
          <LockIcon className="size-4" />
          Só consulta, não altera dados
          {text.length > MAX_LENGTH * 0.9 && (
            <span className="text-danger-ink">
              · {text.length}/{MAX_LENGTH}
            </span>
          )}
        </span>
        <button
          type="submit"
          disabled={!canSubmit}
          aria-label="Enviar pergunta"
          className="btn-brand press group inline-flex size-10 items-center justify-center overflow-hidden rounded-pill"
        >
          <ArrowUpIcon className="size-5 transition-transform duration-300 ease-[var(--ease-out)] group-hover:-translate-y-1 group-disabled:translate-y-0" />
        </button>
      </div>
    </form>
  );
}
