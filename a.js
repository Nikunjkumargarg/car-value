const axios = global.get('axios'); // or any HTTP request library

async function fetchAllOrders() {
  let allOrders = [];
  let url =
    'https://83f4d1-c6.myshopify.com/admin/api/2024-01/orders.json?limit=250'; // Initial URL

  while (url) {
    const data = await axios.get(url);

    allOrders = allOrders.concat(data.orders); // Collect orders

    // Check for the next page
    const nextPageLink = getNextPageLink(response); // Function to extract next page link

    if (nextPageLink) {
      url = nextPageLink;
    } else {
      url = null; // No more pages
    }
  }

  return allOrders;
}

// Helper function to extract next page link from response
function getNextPageLink(response) {
  const linkHeader = response.headers.get('link');
  if (linkHeader) {
    const nextLink = linkHeader
      .split(',')
      .find((s) => s.includes('rel="next"'));
    if (nextLink) {
      return nextLink.split(';')[0].trim().slice(1, -1); // Extract URL from link
    }
  }
  return null;
}

fetchAllOrders()
  .then((allOrders) => {
    console.log(`Fetched ${allOrders.length} orders`);
  })
  .catch((error) => {
    console.error('Error fetching orders:', error);
  });
