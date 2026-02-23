import {
  ClientBuilder,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
} from "@commercetools/sdk-client-v2";
import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";

const projectKey = process.env.CTP_PROJECT_KEY!;
const clientId = process.env.CTP_CLIENT_ID!;
const clientSecret = process.env.CTP_CLIENT_SECRET!;
const authUrl = process.env.CTP_AUTH_URL!;
const apiUrl = process.env.CTP_API_URL!;

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: authUrl,
  projectKey,
  credentials: {
    clientId,
    clientSecret,
  },
  fetch,
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: apiUrl,
  fetch,
};

const client = new ClientBuilder()
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .build();

export const apiRoot = createApiBuilderFromCtpClient(client).withProjectKey({
  projectKey,
});

// ── Distribution Channel (prices are standalone & channel-specific) ──

let _defaultDistributionChannelId: string | null = null;

/**
 * Get the default ProductDistribution channel ID.
 * This dataset uses standalone prices tied to channels, so we need this
 * for price resolution (priceChannel) and for addLineItem (distributionChannel).
 */
export async function getDefaultDistributionChannelId(): Promise<string> {
  if (_defaultDistributionChannelId) return _defaultDistributionChannelId;

  const response = await apiRoot
    .channels()
    .get({
      queryArgs: {
        where: 'roles contains any ("ProductDistribution")',
        limit: 10,
      },
    })
    .execute();

  const channels = response.body.results;
  const defaultCh =
    channels.find((ch) => ch.key === "default-channel") ?? channels[0];

  if (!defaultCh) {
    throw new Error("No ProductDistribution channel found in commercetools.");
  }

  _defaultDistributionChannelId = defaultCh.id;
  return _defaultDistributionChannelId;
}

export async function getProducts(limit = 20, categoryId?: string) {
  const channelId = await getDefaultDistributionChannelId();
  const queryArgs: { limit: number; where?: string; priceChannel: string; priceCurrency: string } = {
    limit,
    priceChannel: channelId,
    priceCurrency: "USD",
  };
  if (categoryId) {
    queryArgs.where = `categories(id="${categoryId}")`;
  }
  const response = await apiRoot
    .productProjections()
    .get({ queryArgs })
    .execute();
  return response.body.results;
}

export async function getCategories() {
  const response = await apiRoot
    .categories()
    .get({ queryArgs: { limit: 20, where: 'parent is not defined' } })
    .execute();
  return response.body.results;
}

export async function getCategoryBySlug(slug: string) {
  const response = await apiRoot
    .categories()
    .get({
      queryArgs: {
        where: `slug(en-US="${slug}") or slug(en="${slug}")`,
        limit: 1,
      },
    })
    .execute();
  return response.body.results[0] ?? null;
}

export async function getProductsByCategory(
  categoryId: string,
  limit = 20,
  offset = 0,
  sort?: string,
  priceMin?: number,
  priceMax?: number
) {
  const channelId = await getDefaultDistributionChannelId();

  const filters: string[] = [`categories.id:"${categoryId}"`];

  if (priceMin !== undefined || priceMax !== undefined) {
    const min = priceMin !== undefined ? priceMin * 100 : "*";
    const max = priceMax !== undefined ? priceMax * 100 : "*";
    filters.push(`variants.scopedPrice.value.centAmount:range (${min} to ${max})`);
  }

  const queryArgs: {
    limit: number;
    offset: number;
    filter: string | string[];
    sort?: string;
    priceChannel: string;
    priceCurrency: string;
  } = {
    limit,
    offset,
    filter: filters,
    priceChannel: channelId,
    priceCurrency: "USD",
  };
  if (sort) {
    queryArgs.sort = sort;
  }
  const response = await apiRoot
    .productProjections()
    .search()
    .get({ queryArgs })
    .execute();
  return {
    results: response.body.results,
    total: response.body.total ?? 0,
    offset: response.body.offset,
    limit: response.body.limit,
  };
}

/**
 * Fetch products that belong to ANY of the given category IDs.
 * Supports optional filtering to a single sub-category, sorting, and pagination.
 */
export async function getProductsByCategories(
  categoryIds: string[],
  limit = 20,
  offset = 0,
  sort?: string,
  filterCategoryId?: string,
  priceMin?: number,
  priceMax?: number
) {
  const channelId = await getDefaultDistributionChannelId();

  // If filtering by a specific sub-category, only use that ID
  const idsToFilter = filterCategoryId ? [filterCategoryId] : categoryIds;
  const filterValue = idsToFilter.map((id) => `"${id}"`).join(",");

  const filters: string[] = [`categories.id:${filterValue}`];

  if (priceMin !== undefined || priceMax !== undefined) {
    const min = priceMin !== undefined ? priceMin * 100 : "*";
    const max = priceMax !== undefined ? priceMax * 100 : "*";
    filters.push(`variants.scopedPrice.value.centAmount:range (${min} to ${max})`);
  }

  const queryArgs: {
    limit: number;
    offset: number;
    filter: string | string[];
    sort?: string;
    priceChannel: string;
    priceCurrency: string;
  } = {
    limit,
    offset,
    filter: filters,
    priceChannel: channelId,
    priceCurrency: "USD",
  };
  if (sort) {
    queryArgs.sort = sort;
  }
  const response = await apiRoot
    .productProjections()
    .search()
    .get({ queryArgs })
    .execute();
  return {
    results: response.body.results,
    total: response.body.total ?? 0,
    offset: response.body.offset,
    limit: response.body.limit,
  };
}

export async function getProductBySlug(
  slug: string
): Promise<import("@commercetools/platform-sdk").ProductProjection | null> {
  try {
    const channelId = await getDefaultDistributionChannelId();
    const response = await apiRoot
      .productProjections()
      .search()
      .get({
        queryArgs: {
          filter: [`slug.en-US:"${slug}"`],
          limit: 1,
          priceChannel: channelId,
          priceCurrency: "USD",
        },
      })
      .execute();

    return response.body.results[0] || null;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}

export async function getAllCategories() {
  const response = await apiRoot
    .categories()
    .get({
      queryArgs: {
        limit: 100,
        sort: ["orderHint asc"],
      },
    })
    .execute();
  return response.body.results;
}

// ── Cart helpers ──

export async function createCart(currency = "USD") {
  const response = await apiRoot
    .carts()
    .post({
      body: {
        currency,
      },
    })
    .execute();
  return response.body;
}

export async function getCartById(cartId: string) {
  try {
    const response = await apiRoot
      .carts()
      .withId({ ID: cartId })
      .get()
      .execute();
    return response.body;
  } catch {
    return null;
  }
}

export async function addLineItem(
  cartId: string,
  cartVersion: number,
  productId: string,
  variantId: number = 1,
  quantity: number = 1
) {
  const distributionChannelId = await getDefaultDistributionChannelId();

  const response = await apiRoot
    .carts()
    .withId({ ID: cartId })
    .post({
      body: {
        version: cartVersion,
        actions: [
          {
            action: "addLineItem",
            productId,
            variantId,
            quantity,
            distributionChannel: {
              typeId: "channel",
              id: distributionChannelId,
            },
          },
        ],
      },
    })
    .execute();
  return response.body;
}

export async function changeLineItemQuantity(
  cartId: string,
  cartVersion: number,
  lineItemId: string,
  quantity: number
) {
  const response = await apiRoot
    .carts()
    .withId({ ID: cartId })
    .post({
      body: {
        version: cartVersion,
        actions: [
          {
            action: "changeLineItemQuantity",
            lineItemId,
            quantity,
          },
        ],
      },
    })
    .execute();
  return response.body;
}

export async function removeLineItem(
  cartId: string,
  cartVersion: number,
  lineItemId: string
) {
  const response = await apiRoot
    .carts()
    .withId({ ID: cartId })
    .post({
      body: {
        version: cartVersion,
        actions: [
          {
            action: "removeLineItem",
            lineItemId,
          },
        ],
      },
    })
    .execute();
  return response.body;
}

// ── Checkout / Order helpers ──

export interface AddressInput {
  firstName: string;
  lastName: string;
  streetName: string;
  additionalStreetInfo?: string;
  city: string;
  region?: string;
  postalCode: string;
  country: string; // ISO 3166-1 alpha-2 (e.g. "US")
  email?: string;
  phone?: string;
}

/**
 * Set both shipping and billing addresses on a cart.
 */
export async function setCartAddresses(
  cartId: string,
  cartVersion: number,
  shippingAddress: AddressInput,
  billingAddress: AddressInput
) {
  const response = await apiRoot
    .carts()
    .withId({ ID: cartId })
    .post({
      body: {
        version: cartVersion,
        actions: [
          {
            action: "setShippingAddress",
            address: shippingAddress,
          },
          {
            action: "setBillingAddress",
            address: billingAddress,
          },
        ],
      },
    })
    .execute();
  return response.body;
}

/**
 * Create an order from an active cart.
 */
export async function createOrderFromCart(
  cartId: string,
  cartVersion: number
) {
  const response = await apiRoot
    .orders()
    .post({
      body: {
        cart: {
          typeId: "cart",
          id: cartId,
        },
        version: cartVersion,
        orderState: "Open",
        paymentState: "Pending",
      },
    })
    .execute();
  return response.body;
}

/**
 * Get an order by ID.
 */
export async function getOrderById(orderId: string) {
  try {
    const response = await apiRoot
      .orders()
      .withId({ ID: orderId })
      .get()
      .execute();
    return response.body;
  } catch {
    return null;
  }
}

/**
 * Get all orders for a customer by email, newest first.
 */
export async function getOrdersByCustomerEmail(
  email: string,
  limit = 50,
  offset = 0
) {
  try {
    const response = await apiRoot
      .orders()
      .get({
        queryArgs: {
          where: `customerEmail="${email}"`,
          sort: ["createdAt desc"],
          limit,
          offset,
        },
      })
      .execute();
    return {
      results: response.body.results,
      total: response.body.total ?? 0,
    };
  } catch (error) {
    console.error("Error fetching orders by email:", error);
    return { results: [], total: 0 };
  }
}

/**
 * Get a customer by email address.
 */
export async function getCustomerByEmail(email: string) {
  try {
    const response = await apiRoot
      .customers()
      .get({
        queryArgs: {
          where: `email="${email}"`,
          limit: 1,
        },
      })
      .execute();
    return response.body.results[0] ?? null;
  } catch (error) {
    console.error("Error fetching customer by email:", error);
    return null;
  }
}

// ── Search helpers ──

/**
 * Full-text search for products using commercetools product projections search.
 * Includes all products regardless of stock availability.
 * Fuzzy matching is disabled by default for precise results.
 */
export async function searchProducts(
  query: string,
  limit = 20,
  offset = 0,
  sort?: string,
  fuzzy = false,
  priceMin?: number,
  priceMax?: number
) {
  const channelId = await getDefaultDistributionChannelId();

  const filters: string[] = [];
  if (priceMin !== undefined || priceMax !== undefined) {
    const min = priceMin !== undefined ? priceMin * 100 : "*";
    const max = priceMax !== undefined ? priceMax * 100 : "*";
    filters.push(`variants.scopedPrice.value.centAmount:range (${min} to ${max})`);
  }

  const queryArgs: {
    "text.en-US": string;
    fuzzy: boolean;
    limit: number;
    offset: number;
    priceChannel: string;
    priceCurrency: string;
    sort?: string;
    filter?: string | string[];
  } = {
    "text.en-US": query,
    fuzzy,
    limit,
    offset,
    priceChannel: channelId,
    priceCurrency: "USD",
  };

  if (sort) {
    queryArgs.sort = sort;
  }

  if (filters.length > 0) {
    queryArgs.filter = filters;
  }

  const response = await apiRoot
    .productProjections()
    .search()
    .get({ queryArgs })
    .execute();

  return {
    results: response.body.results,
    total: response.body.total ?? 0,
    offset: response.body.offset,
    limit: response.body.limit,
  };
}

export default apiRoot;
