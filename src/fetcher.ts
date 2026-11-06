import 'dotenv/config';
import '@shopify/shopify-api/adapters/node';
import {shopifyApi, ApiVersion} from '@shopify/shopify-api';
import { type Item, type Order } from './models.ts';
import { MaterialType } from './enums.ts';
import { getValueForItemWithKey, letterFromIndex, stripNonNumbers } from './helpers.ts';

const apiKey = process.env['API_KEY'] ?? null;
const apiSecretKey = process.env['API_SECRET'] ?? null;
const shopName = process.env['SHOP_NAME'] ?? null;

if (apiKey === null || apiSecretKey === null || shopName === null) {
    throw new Error("One or more required environment variables missing. Did you fill out the .env?");
} 

const shopify = shopifyApi({
  apiKey,
  apiSecretKey,
  scopes: ['read_products','read_orders', 'read_customers'],
  hostName: 'localhost',
  apiVersion: ApiVersion.October26,
  isEmbeddedApp: false,
  _logDisabledFutureFlags: false
});
const auth = await shopify.auth.clientCredentials({
    shop: shopName
});
const {session} = auth;
const adminApi = new shopify.clients.Graphql({session});

const id = "1026";
const order = await adminApi.request(
    `query OrderInfo($orderId: String!) {
        orders(first: 1, query: $orderId) {
            edges {
                node {
                    customer {
                        numberOfOrders
                    }
                    discountCodes
                    email
                    id
                    name
                    lineItems(first: 10) {
                        edges {
                            node {
                                id
                                title
                                quantity
                                variant {
                                    id
                                    displayName
                                    metafields(first: 5, namespace: "custom") {
                                        edges {
                                            node {
                                                id
                                                key
                                                value
                                            }
                                        }
                                    }
                                }
                                customAttributes {
                                    key
                                    value
                                }
                            }
                        }
                    }
                }
            }
        }
    }`,
    {
        "variables": {
            "orderId": `name:${id}`
        }
    }
);
const details = order.data["orders"]["edges"][0]["node"];
console.log(JSON.stringify(details, null, 2));
const storage: Order = {
    id,
    discountCodes: details["discountCodes"],
    customer: {
        numberOfOrders: details["customer"]["numberOfOrders"],
    },
    items: (details["lineItems"]["edges"] as Array<any>).map(e => {
        const lineItem: any = e["node"];
        const customAttributes = lineItem["customAttributes"];
        return {
            width: stripNonNumbers(getValueForItemWithKey(customAttributes, "Width")),
            height: stripNonNumbers(getValueForItemWithKey(customAttributes, "Height")),
            itemQuantity: lineItem["quantity"],
            stickerQuantity: getValueForItemWithKey(customAttributes, "Sticker Count"),
        } as Item;
    }).reduce((arr, item, i) => ({...arr, [letterFromIndex(i)]: item}), {})
};

const out = JSON.stringify(storage, null, 2);
console.log(out);

