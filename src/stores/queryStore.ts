import { actionFor, mapTemplate } from "nanostores";
import { useStore } from "@nanostores/preact";
import { useEffect } from "preact/hooks";

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
    const status = store.get().status;
    if (status === "loading") {
      return;
    }

    store.setKey("status", "loading");
    try {
      const data = await queryFn();

      store.setKey("data", data);
    } catch (error) {
      store.setKey("error", error);
      store.setKey("status", "error");
    }
    store.setKey("status", "success");
  }
);

export function useQuery<T>(key: string, queryFn: () => Promise<T>) {
  const query = Query(key);
  const { data, status, error } = useStore(query);

  useEffect(() => {
    queryData(query, queryFn);
  }, []);

  return { data, status, error };
}
