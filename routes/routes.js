const { getShopifyOrders, getShopifyProducts } = require("../controller/shopify");
const { getOrders, getProducts } = require("../controller/wooCommerce");

const { Router } = require("express");

const router = Router()

router.get("/woocommerce/list-orders", getOrders)
router.get("/woocommerce/list-products", getProducts)
router.get("/shopify/list-orders", getShopifyOrders)
router.get("/shopify/list-products", getShopifyProducts)


module.exports = router;