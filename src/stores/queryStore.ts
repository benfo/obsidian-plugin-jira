import { actionFor, mapTemplate } from "nanostores";
import { useStore } from "@nanostores/preact";
import { useEffect } from "preact/hooks";
import log from "loglevel";

const logger = log.getLogger("queryStore");

type QueryValue = {
  id: string;
  status?: "loading" | "error" | "success";
  data?: any;
  error?: any;
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
    } catch (error) {
      store.setKey("error", error);
      store.setKey("status", "error");
    }
    store.setKey("status", "success");
  }
);

export function useQuery<T>(key: string | string[], queryFn: () => Promise<T>) {
  let k: string[] = typeof key === "string" ? [key] : key;
  const query = Query(k.join("-"));
  const { data, status, error } = useStore(query);

  useEffect(() => {
    queryData(query, queryFn);
  }, []);

  return { data, status, error };
}
