# ReceiptProcessor

## Language Selection
JavaScript running on a dockerized express server
Steps I use to build and run:
1) docker build --tag receiptprocessor .
2) docker run -d -p 3000:3000 --name ReceiptProcessor receiptprocessor
## Summary of API Specification

### Endpoint: Process Receipts
* Path: `/receipts`
* Method: `GET`
* Response: Returns UL of currently processed receipts

Returns unordered list of currently processed receipts. Useful for viewing in browser at http://localhost:3000/receipts with hyperlinks to see results of Get Points endpoint.

### Endpoint: Process Receipts
* Path: `/receipts/process`
* Method: `POST`
* Payload: Receipt JSON
* Response: JSON containing an id for the receipt.

Takes in a JSON receipt and returns a JSON object with an ID generated by hashing the receipt's JSON.

Example Response:
```json
{ "id": "7fb1377b-b223-49d9-a31a-5a02701dd310" }
```

### Endpoint: Get Points
Given an ID for a receipt, returns the point value that was generated upon submission by the process endpoint.
* Path: `/receipts/{id}/points`
* Method: `GET`
* Response: A JSON object containing the number of points awarded.

A simple Getter endpoint that looks up the receipt by the ID and returns an object specifying the points awarded.

Example Response:
```json
{ "points": 32 }
```

## Examples
### POST test with curl
```
curl --request POST \
  --url http://localhost:3000/receipts/process \
  --header 'content-type: application/json' \
  --data '{
  "retailer": "Target",
  "purchaseDate": "2022-01-01",
  "purchaseTime": "13:01",
  "items": [
    {
      "shortDescription": "Mountain Dew 12PK",
      "price": "6.49"
    },{
      "shortDescription": "Emils Cheese Pizza",
      "price": "12.25"
    },{
      "shortDescription": "Knorr Creamy Chicken",
      "price": "1.26"
    },{
      "shortDescription": "Doritos Nacho Cheese",
      "price": "3.35"
    },{
      "shortDescription": "   Klarbrunn 12-PK 12 FL OZ  ",
      "price": "12.00"
    }
  ],
  "total": "35.35"
}'
```
### GET test with curl
curl http://localhost:3000/receipts/-718398167/points

curl http://localhost:3000/receipts/215879314/points
