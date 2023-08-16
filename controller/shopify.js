const axios = require("axios")


const getShopifyOrders = async (req, res) => {
  try {
    const requiredFields = ["startDate", "endDate"]
    requiredFields.forEach((field) => {
      if (!req.query[field] || req.query[field] === "") {
        throw ({
          status: 400,
          message: "error",
          error: `required field ${field} missing or empty`
        })
      }
    })

    // shopify url
    const shopifyShop = `https://${process.env.HOST}.myshopify.com/admin/api/${process.env.API_VERSION}/graphql.json`;
    const apiKey = process.env.ACCESS_TOKEN;
    const { startDate, endDate, count = 5, cursor = null, isNextPage = false, isPrevPage = false } = req.query
    let pagination = `first:${+count}`; // default choose first count elements
    if (isNextPage === "true" && cursor) {
      // if nextPage available then cursor added with after and return element will be from first
      pagination = `first:${+count}, after: "${cursor}"`
    }
    if (isPrevPage === "true" && cursor) {
      // if user got previous page then cursor added with before and return element will be from last
      pagination = `last:${+count}, before: "${cursor}"`
    }
    const query = `{
      orders(
        ${pagination}
        query: "created_at:>${startDate}, created_at:<${endDate}",
        sortKey: CREATED_AT
        reverse: false
        ) {
          edges {
            node {
              id
              name
              createdAt
            }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }`;
    const response = await axios.post(
      shopifyShop,
      { query },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': apiKey,
        },
      }
    );
    const { data: { orders = [] } } = response.data;
    return res.status(200).json({
      status: 200,
      message: "success",
      data: orders
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
};
/**
 * graphql query to fetch data
 * @param {Number} count - each query data count. default 100
 * @param {String} cursor - end pointing data identifier
 * @param {Boolean} isNextPage - true or false
 * @returns 
 */
async function graphqlQuery(count, cursor, isNextPage) {
  // shopify url
  const shopifyShop = `https://${process.env.HOST}.myshopify.com/admin/api/${process.env.API_VERSION}/graphql.json`;
  const apiKey = process.env.ACCESS_TOKEN;
  let pagination = `first:${count}`; // default choose first count elements
  if (isNextPage && cursor) {
    // if nextPage available then cursor added with after and return element will be from first
    pagination = `first:${count}, after: "${cursor}"`
  }
  const query = `{
    products(
      ${pagination}
      sortKey: TITLE
      reverse: false
      ) {
        edges {
          node {
            id
            title
            description
            productType
            vendor
            createdAt
          }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }`;
  const response = await axios.post(
    shopifyShop,
    { query },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': apiKey,
      },
    }
  );
  const { data: { products = {} } } = response.data;
  return products;
}

const getShopifyProducts = async (req, res) => {
  try {
    let isNext = true, totalProducts = [], cursor = null, isNextPage = false
    while (isNext) {
      const products = await graphqlQuery(count = 100, cursor, isNextPage)
      totalProducts = [...totalProducts, ...products.edges]
      if (products.pageInfo.hasNextPage) {
        isNextPage = true
        cursor = products.pageInfo.endCursor
      } else{
        isNext = false
      }
    }
    return res.status(200).json({
      status: 200,
      message: "success",
      data: totalProducts
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
};

module.exports = { getShopifyOrders, getShopifyProducts }




