# Shopify Order Details Fetcher
We handle client orders by placing all the relevant source files and order details for an order into a folder, and then as we go through the proof and print process for that order things like Illustrator files and postscript files and cut job reports all get dumped there too so the whole history of the order is in one place. We have some other tools which need details about the order to function and this script produces the authoritative details file for an order using the Shopify API.

# General Flow
This script:
1. Asks for an order number
2. Creates a folder for that order
3. Goes to the Shopify API and gets details about the order
4. Maps Shopify order details into a standard object form that other tools can use and saves that to a details.json file in the folder
5. Downloads client-submitted source images to the folder as well
6. Calculates some stats about the images such as PPI and stores those to the details.json

# How to use
1. Create a new shopify app as the account that owns the store. Only the store-owning account can use the endpoint. It doesn't matter what the app is named, just that it has the `read_products`, `read_orders`, and `read_customers` permission scopes.
2. Install the app on your store.
3. Rename the `.env.example` file to `.env`
4. Copy the client ID and client secret and your store name and put them into the .env file
5. Run the app
