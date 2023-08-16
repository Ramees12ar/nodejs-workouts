
# Nodejs Tasks

order and products listing APIs for shopify and woocommerce


## API Reference

### Host: ```http://localhost:3001```

#### Get orders from wooCommerce

```http
  GET /api/woocommerce/list-orders
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `startDate` | `date` | **Required**. |
| `endDate` | `date` | **Required**. |
| `page` | `number` | **Optional**. default 1 |
| `limit` | `number` | **Optional**. default 5 |

#### Get all products from wooCommerce

```http
  GET /api/woocommerce/list-products
```

#### Get orders from shopify Graphql

```http
  GET /api/shopify/list-orders
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `startDate` | `date` | **Required**. |
| `endDate` | `date` | **Required**. |
| `count` | `number` | **Optional**. default 5|
| `cursor` | `string` | **Optional**. |
| `isNextPage` | `boolean` | **Optional**. true/false |
| `isPrevPage` | `boolean` | **Optional**. true/false|

#### Get all products from shopify Graphql

```http
  GET /api/shopify/list-products
```





