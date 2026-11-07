import 'dotenv/config';
import readline from 'node:readline/promises';
import '@shopify/shopify-api/adapters/node';
import {shopifyApi, ApiVersion} from '@shopify/shopify-api';
import { type Item, type Order } from './models.ts';
import { LaminateType, MaterialType, WhiteInkBehaviour } from './enums.ts';
import { getOptionalValueForItemWithKey, getRequiredValueForItemWithKey, getUploadlyImagesForFieldName, letterFromIndex, stripNonNumbers } from './helpers.ts';

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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const id = await rl.question("What order do you want to get details for? ");
if (id == null || id.length == 0) {
    throw new Error("No id provided!");
}
rl.close();

const order = await adminApi.request(
    `query OrderInfo($orderId: String!) {
        orders(first: 1, query: $orderId) {
            edges {
                node {
                    customer {
                        numberOfOrders
                        displayName
                    }
                    discountCodes
                    email
                    id
                    createdAt
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
    date: details["createdAt"],
    discountCodes: details["discountCodes"],
    customer: {
        name: details["customer"]["displayName"],
        numberOfOrders: details["customer"]["numberOfOrders"],
        email: details["email"],
    },
    items: (details["lineItems"]["edges"] as Array<any>).map(e => {
        const lineItem: any = e["node"];
        const productVariant: any = lineItem["variant"];
        const customAttributes = lineItem["customAttributes"];
        const variantMetafields = productVariant["metafields"]["edges"];
        return {
            width: stripNonNumbers(getRequiredValueForItemWithKey(customAttributes, "Width")),
            height: stripNonNumbers(getRequiredValueForItemWithKey(customAttributes, "Height")),
            itemQuantity: lineItem["quantity"],
            stickerQuantity: getRequiredValueForItemWithKey(customAttributes, "Sticker Count"),
            originalImageUrls: getUploadlyImagesForFieldName(customAttributes, "Upload Sticker Image"),
            baseMaterial: MaterialType.fromAttribute(lineItem["title"]),
            laminateMaterial: LaminateType.fromAttribute(getOptionalValueForItemWithKey(customAttributes, "Finish")),
            // shape: string;
            borderSize: getRequiredValueForItemWithKey(customAttributes, "Border Size"),
            // TODO pull tab/accessibility options
            whiteInkBehaviour: WhiteInkBehaviour.fromAttribute(getOptionalValueForItemWithKey(customAttributes, "White Color")),
            instructions: getRequiredValueForItemWithKey(customAttributes, "Instructions"),
            socialMediaPosting: (() => {
                const str = getOptionalValueForItemWithKey(customAttributes, "Social Media");
                return str != undefined && str.length > 0;
             })(),
            socialMediaHandle: getOptionalValueForItemWithKey(customAttributes, "Social Media Handle"),
        } as Item;
    }).reduce((arr, item, i) => ({...arr, [letterFromIndex(i)]: item}), {})
};

//create directory

//download images

//postprocess (ppi for requested size)

const out = JSON.stringify(storage, null, 2);
console.log(out);



