document.getElementById("fetch-sales").addEventListener("click", async () => {
  const salesList = document.getElementById("sales-list");
  salesList.innerHTML = ""; // Clear previous results

  const games = await fetchSteamData();

  games.forEach((game) => {
    const discountEndTimestamp =
      game.best_purchase_option.active_discounts[0].discount_end_date;
    const discountEndDate = new Date(discountEndTimestamp * 1000); // Convert from seconds to milliseconds

    const listItem = document.createElement("li");
    listItem.innerHTML = `
              <h3>${game.name}</h3>
              <p>Original Price: ${
                game.best_purchase_option.formatted_original_price
              }</p>
              <p>Sale Price: ${
                game.best_purchase_option.formatted_final_price
              }</p>
              <p>Discount: ${game.best_purchase_option.discount_pct}%</p>
              <p>Sale Ends: ${discountEndDate.toLocaleString()}</p>
          `;
    salesList.appendChild(listItem);
  });
});

async function fetchSteamData() {
  const apiKey = "11279684546945A2529B308B9FCE41C1ABD016"; // Replace with your actual API key if needed
  const url = "http://store.steampowered.com/api/featuredcategories/?l=english"; // Replace with correct endpoint

  try {
    const response = await axios.get(url);
    const storeItems = response.data.response.store_items;

    // Filter games with active discounts
    const gamesOnSale = storeItems.filter(
      (item) =>
        item.best_purchase_option && item.best_purchase_option.discount_pct > 0
    );
    return gamesOnSale;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
