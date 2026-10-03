# Shopify Order Details Fetcher
We handle client orders by placing all the relevant source files and order details for an order into a folder, and then as we go through the proof and print process for that order things like Illustrator files and postscript files and cut job reports all get dumped there too so the whole history of the order is in one place. We have some other tools which need details about the order to function and this script produces the authoritative details file for an order using the Shopify API.

# General Flow
This script:
1. Asks for an order number
2. Creates a folder for that order
3. Goes to the Shopify API and gets details about the order
4. Maps Shopify order details into a standard object form that other tools can use and saves that to a details.json file in the folder
5. Downloads client-submitted source images to the folder as well
