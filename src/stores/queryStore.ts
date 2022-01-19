import { actionFor, mapTemplate } from "nanostores";
import { useStore } from "@nanostores/preact";
import { useEffect, useState } from "preact/hooks";
import { getLogger } from "loglevel";

const logger = getLogger("queryStore");

type QueryValue = {
  id: string;
  status?: "loading" | "error" | "success";
  data?: any;
  error?: any;
};

type QueryOptions = {
  enabled?: boolean;
};

const Query = mapTemplate<QueryValue>();

const queryData = actionFor(
  Query,
  "updateData",
  async (store, queryFn: () => Promise<any>) => {
    const value = store.get();
    if (value.status) {
      logger.debug("Not running query because status has a value.", {
        id: value.id,
        status: value.status,
      });
      return;
    }

    store.setKey("status", "loading");
    try {
      logger.debug("Running query.", {
        id: value.id,
      });

      const data = await queryFn();

      store.setKey("data", data);
      store.setKey("status", "success");
    } catch (error) {
      store.setKey("error", error);
      store.setKey("status", "error");
      store.setKey("data", undefined);
    }
  }
);

export function generateKey(keys: string[]) {
  return keys.sort().join("-");
}

export function useQuery<T>(
  key: string | string[],
  queryFn: () => Promise<T>,
  options: QueryOptions = { enabled: true }
) {
  const [enabled, setEnabled] = useState(options.enabled);
  const keys: string[] = typeof key === "string" ? [key] : key;
  const query = Query(generateKey(keys));
  const { data, status, error } = useStore(query);

  useEffect(() => {
    if (!enabled) return;
    queryData(query, queryFn);
  }, [enabled]);

  return { data, status, error, enabled, setEnabled };
}
