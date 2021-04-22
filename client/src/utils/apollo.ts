import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { AccountsGraphQLClient } from "@accounts/graphql-client";
import { AccountsClientPassword } from "@accounts/client-password";
import { AccountsClient } from "@accounts/client";
import { accountsLink } from "@accounts/apollo-link";

const httpLink = createHttpLink({
  uri: "http://127.0.0.1:4000"
});

const cache = new InMemoryCache();

// accounts js
export const graphQLApolloClient = new ApolloClient({
  link: ApolloLink.from([httpLink]),
  cache
});

export const accountsGraphQL = new AccountsGraphQLClient({
  graphQLClient: graphQLApolloClient
});
export const accountsClient = new AccountsClient({}, accountsGraphQL);
export const accountsPassword = new AccountsClientPassword(accountsClient);

// regular apollo client
const authLink = accountsLink(() => accountsClient);

export const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache
});
