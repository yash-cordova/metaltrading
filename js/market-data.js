// Metal price data fetching and display
document.addEventListener("DOMContentLoaded", function () {
  console.log("Market data script loaded");

  const metals = [
    { id: "copper", name: "Copper", symbol: "HG=F" },
    { id: "aluminum", name: "Aluminum", symbol: "ALI=F" },
    { id: "gold", name: "Gold", symbol: "XAU=F" },
    { id: "zinc", name: "Zinc", symbol: "ZN=F" },
  ];
  const priceContainer = document.getElementById("live-prices");
  let currentExchangeRate = null;

  // Multiple CORS proxies for fallback
  const PROXIES = [
    "https://api.allorigins.win/raw?url=",
    "https://api.codetabs.com/v1/proxy?quest=",
    "https://corsproxy.io/?",
    "https://cors-anywhere.herokuapp.com/",
  ];

  if (!priceContainer) {
    console.error(
      "Price container not found! Make sure there is an element with id='live-prices'"
    );
    return;
  }

  console.log("Price container found:", priceContainer);

  // Function to try fetching with different proxies
  const fetchWithProxy = async (url, proxyIndex = 0) => {
    if (proxyIndex >= PROXIES.length) {
      throw new Error("All proxies failed");
    }

    try {
      const proxyUrl = PROXIES[proxyIndex] + encodeURIComponent(url);
      console.log(`Trying proxy ${proxyIndex + 1}: ${proxyUrl}`);

      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn(`Proxy ${proxyIndex + 1} failed:`, error);
      // Try next proxy
      return fetchWithProxy(url, proxyIndex + 1);
    }
  };

  // Function to fetch current USD/INR exchange rate
  const fetchExchangeRate = async () => {
    try {
      const url = "https://query1.finance.yahoo.com/v8/finance/chart/USDINR=X";
      const data = await fetchWithProxy(url);

      if (!data.chart || !data.chart.result || !data.chart.result[0]) {
        throw new Error("Invalid exchange rate data");
      }

      currentExchangeRate = data.chart.result[0].meta.regularMarketPrice;
      console.log("Current USD/INR rate:", currentExchangeRate);
      return currentExchangeRate;
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      throw error;
    }
  };

  // Function to format price in USD
  const formatUSD = (price) => {
    if (isNaN(price)) {
      return "N/A";
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Function to format price in INR
  const formatINR = (price) => {
    if (isNaN(price)) {
      return "N/A";
    }
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Function to format date
  const formatDate = (date) => {
    return new Date(date * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Function to create price card
  const createPriceCard = (metal, data) => {
    console.log(`Creating price card for ${metal.name}:`, data);

    // Handle NaN values for price change calculation
    let changePercent = 0;
    let isPositive = true;

    if (!isNaN(data.current) && !isNaN(data.history[data.history.length - 1])) {
      const change = data.current - data.history[data.history.length - 1];
      changePercent = (change / data.history[data.history.length - 1]) * 100;
      isPositive = change >= 0;
    }

    // Convert USD to INR using current exchange rate
    const inrPrice = isNaN(data.current)
      ? NaN
      : data.current * currentExchangeRate;
    const inrHistory = data.history.map((price) =>
      isNaN(price) ? NaN : price * currentExchangeRate
    );

    return `
            <div class="price-card" data-aos="fade-up">
                <div class="price-header">
                    <h3>${metal.name}</h3>
                    ${
                      !isNaN(changePercent)
                        ? `
                        <span class="price-change ${
                          isPositive ? "up" : "down"
                        }">
                            ${isPositive ? "+" : ""}${changePercent.toFixed(2)}%
                        </span>
                    `
                        : ""
                    }
                </div>
                <div class="price-details">
                    <div class="price-row">
                        <span class="currency-label">USD</span>
                        <span class="current-price">${formatUSD(
                          data.current
                        )}</span>
                    </div>
                    <div class="price-row">
                        <span class="currency-label">INR</span>
                        <span class="current-price">${formatINR(
                          inrPrice
                        )}</span>
                    </div>
                    <div class="exchange-rate">
                        <small>1 USD = ${formatINR(currentExchangeRate)}</small>
                    </div>
                </div>
                <div class="price-history">
                    <div class="history-header">3-Day History (USD)</div>
                    ${data.history
                      .map(
                        (price, index) => `
                        <div class="history-item">
                            <span class="date">${formatDate(
                              data.timestamps[index]
                            )}</span>
                            <span class="price">${formatUSD(price)}</span>
                        </div>
                    `
                      )
                      .join("")}
                </div>
            </div>
        `;
  };

  // Function to create error card
  const createErrorCard = (metal) => {
    return `
            <div class="price-card error" data-aos="fade-up">
                <div class="price-header">
                    <h3>${metal.name}</h3>
                </div>
                <div class="error-message">
                    Unable to show price
                </div>
            </div>
        `;
  };

  // Function to fetch metal prices from Yahoo Finance
  const fetchMetalPrices = async (metal) => {
    try {
      console.log(`Fetching price for ${metal.name}...`);

      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${metal.symbol}?interval=1d&range=5d`;
      const data = await fetchWithProxy(url);

      if (!data.chart || !data.chart.result || !data.chart.result[0]) {
        throw new Error("Invalid price data");
      }

      const result = data.chart.result[0];
      const timestamps = result.timestamp;
      const quotes = result.indicators.quote[0];

      // Get current price (in USD)
      const currentPrice = result.meta.regularMarketPrice;

      // Get last 3 days of closing prices (in USD)
      const history = quotes.close.slice(-4, -1); // Last 3 days excluding today
      const historyTimestamps = timestamps.slice(-4, -1);

      // Validate the data
      if (isNaN(currentPrice) || history.some((price) => isNaN(price))) {
        throw new Error("Invalid price data received");
      }

      return {
        current: currentPrice,
        history: history,
        timestamps: historyTimestamps,
      };
    } catch (error) {
      console.error(`Error fetching ${metal.name} price:`, error);
      throw error;
    }
  };

  // Function to update prices
  const updatePrices = async () => {
    console.log("Updating prices...");

    try {
      // First fetch the current exchange rate
      await fetchExchangeRate();

      const pricesHTML = [];

      for (const metal of metals) {
        try {
          const data = await fetchMetalPrices(metal);
          pricesHTML.push(createPriceCard(metal, data));
        } catch (error) {
          console.error(`Failed to fetch ${metal.name} price:`, error);
          pricesHTML.push(createErrorCard(metal));
        }
      }

      if (pricesHTML.length > 0) {
        priceContainer.innerHTML = pricesHTML.join("");
        console.log("Prices updated successfully");
      } else {
        throw new Error("No price data available");
      }
    } catch (error) {
      console.error("Error updating prices:", error);
      priceContainer.innerHTML =
        '<div class="error-message">Unable to fetch price data. Please try again later.</div>';
    }
  };

  // Initial update
  console.log("Starting initial price update...");
  updatePrices();

  // Update every 5 minutes
  setInterval(updatePrices, 5 * 60 * 1000);
});
