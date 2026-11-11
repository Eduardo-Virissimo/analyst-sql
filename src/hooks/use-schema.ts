"use client";

import { useEffect, useState } from "react";
import type { DatabaseSchema } from "@/lib/db/schema";
import { fetchSchema } from "@/lib/ui/schema-client";

export type SchemaState =
  | { status: "loading" }
  | { status: "ready"; schema: DatabaseSchema }
  | { status: "error"; message: string };

// Carrega a estrutura do banco uma vez, ao abrir a página.
export function useSchema(): SchemaState {
  const [state, setState] = useState<SchemaState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetchSchema()
      .then((schema) => !cancelled && setState({ status: "ready", schema }))
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Não foi possível carregar o banco.";
        setState({ status: "error", message });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
