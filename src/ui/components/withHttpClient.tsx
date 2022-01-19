import { ObsidianHttpClient, DefaultHttpClientOptions } from "../../http";
import { HttpClientProvider } from "../../preact";

function withHttpClient(WrappedComponent: any) {
  const client = new ObsidianHttpClient(DefaultHttpClientOptions);

  return () => (
    <HttpClientProvider client={client}>
      <WrappedComponent />
    </HttpClientProvider>
  );
}

export default withHttpClient;
