const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
require('dotenv').config();

// wooCommerce connection setup
const WooCommerce = new WooCommerceRestApi({
    url: process.env.URL,
    consumerKey: process.env.CONSUMER_KEY,
    consumerSecret: process.env.CONSUMER_SECRET,
    version: process.env.VERSION
});

const getOrders = async (req, res) => {
    try {
        const requiredFields = ["startDate", "endDate"]
        requiredFields.forEach((field) => {
            if (!req.query[field] || req.query[field] === "") {
                return res.status(400).json({
                    status: 400,
                    message: "error",
                    error: `required field ${field} missing or empty`
                })
            }
        })
        const { startDate, endDate, page, limit } = req.query
        // query data from wooCommerce site
        const result = await WooCommerce.get("orders", {
            after: new Date(startDate),
            before: new Date(endDate),
            page: +page || 1,
            per_page: +limit || 5,
            orderby: 'date',
            order: 'asc',
        })
        return res.status(200).json({
            status: 200,
            message: "success",
            data: {
                orders: result.data,
                totalOrders: result.headers['x-wp-total']
            }
        })
    } catch (err) {
        if (err.response) {
            return res.status(err.response.status || 500).json({
                status: err.response.status || 500,
                message: err.response.statusText || "error",
                error: err.response.data || "unknown error"
            })
        }
        return res.status(err.status || 500).json({
            status: err.status || 500,
            message: err.message || "error",
            error: err.error || "unknown error"
        })
    }
}

async function queryProducts(page) {
    // query data from wooCommerce site
    const result = await WooCommerce.get("products", {
        page,
        per_page: 5,
        orderby: 'title',
        order: 'asc',
    })
    return result;
}
const getProducts = async (req, res) => {
    try {
        let isProductExist = true, page=1, totalProducts = [], count = 0, totalCount;
        while (isProductExist) {
            const result = await queryProducts(page)
            totalCount = +result.headers['x-wp-total']  // + used to convert string to integer
            totalProducts = [...totalProducts, ...result.data]
            count = count + result.data.length
            if(totalCount === count){
                isProductExist = false
            }
            page += 1
        }
        return res.status(200).json({
            status: 200,
            message: "success",
            data: {
                products: totalProducts,
                totalCount
            }
        })
    } catch (err) {
        if (err.response) {
            return res.status(err.response.status || 500).json({
                status: err.response.status || 500,
                message: err.response.statusText || "error",
                error: err.response.data || "unknown error"
            })
        }
        return res.status(err.status || 500).json({
            status: err.status || 500,
            message: err.message || "error",
            error: err.error || "unknown error"
        })
    }
}

module.exports = { getOrders, getProducts }