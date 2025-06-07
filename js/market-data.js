// Metal price data fetching and display
document.addEventListener("DOMContentLoaded", function () {
  console.log("Market data script loaded");

  // API Configuration
  const FMP_API = {
    baseUrl: "https://api.metals.dev/v1",
    apiKey: "1PIOP75RSVZH7UHJFVWL249HJFVWL",
  };

  // List of metals to track
  const metals = [
    { symbol: "copper", name: "Copper" },
    { symbol: "aluminum", name: "Aluminum" },
    { symbol: "lead", name: "Lead" },
    { symbol: "nickel", name: "Nickel" },
    { symbol: "zinc", name: "Zinc" },
  ];

  // Available units
  const units = [
    { value: "g", label: "Grams (g)" },
    { value: "kg", label: "Kilograms (kg)" },
    { value: "toz", label: "Troy Ounce (toz)" },
    { value: "mt", label: "Metric Ton (mt)" },
  ];

  const priceContainer = document.getElementById("live-prices");
  let currentExchangeRate = null;

  if (!priceContainer) {
    console.error(
      "Price container not found! Make sure there is an element with id='live-prices'"
    );
    return;
  }

  console.log("Price container found:", priceContainer);

  // Function to fetch metal prices
  const fetchMetalPrices = async (unit) => {
    try {
      const response = await fetch(
        `${FMP_API.baseUrl}/latest?api_key=${FMP_API.apiKey}&currency=INR&unit=${unit}`
      );
      const data = await response.json();

      if (!data || !data.metals) {
        throw new Error("Invalid API response");
      }

      const prices = {};
      metals.forEach((metal) => {
        if (data.metals[metal.symbol] !== undefined) {
          prices[metal.symbol] = {
            current: data.metals[metal.symbol],
            timestamp: new Date(data.timestamps.metal),
          };
        }
      });

      return prices;
    } catch (error) {
      console.error("Error fetching metal prices:", error);
      throw error;
    }
  };

  // Function to format INR price
  const formatINR = (price) => {
    if (isNaN(price)) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Function to create unit selector
  const createUnitSelector = (currentUnit) => {
    return `
        <div class="unit-selector">
            <label for="unitSelect" class="form-label">Select Price Unit</label>
            <select id="unitSelect" class="form-select">
                ${units
                  .map(
                    (unit) => `
                    <option value="${unit.value}" ${
                      unit.value === currentUnit ? "selected" : ""
                    }>
                        ${unit.label}
                    </option>
                `
                  )
                  .join("")}
            </select>
        </div>
    `;
  };

  // Function to create metal price card
  const createPriceCard = (metal, data, unit) => {
    const unitLabel =
      units.find((u) => u.value === unit)?.label.split(" ")[0] || unit;

    return `
        <div class="hover-card">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${metal.name}</h5>
                    <h6 class="card-subtitle">Spot Price per ${unitLabel}</h6>
                    <div class="price-section">
                        <div class="inr-price">${formatINR(data.current)}</div>
                    </div>
                    <div class="timestamp">
                        <small>Updated: ${data.timestamp.toLocaleTimeString()}</small>
                    </div>
                </div>
            </div>
        </div>
    `;
  };

  // Function to update prices
  const updatePrices = async (unit = "g") => {
    try {
      console.log("Fetching prices...");
      const metalData = await fetchMetalPrices(unit);

      const priceContainer = document.getElementById("live-prices");
      if (priceContainer) {
        console.log("Updating price container with data:", metalData);
        priceContainer.innerHTML = `
          ${createUnitSelector(unit)}
          <div class="price-container">
            ${metals
              .map((metal) => {
                const data = metalData[metal.symbol];
                return data ? createPriceCard(metal, data, unit) : "";
              })
              .join("")}
          </div>
        `;

        // Add event listener for unit change
        const unitSelect = document.getElementById("unitSelect");
        if (unitSelect) {
          unitSelect.addEventListener("change", (e) => {
            updatePrices(e.target.value);
          });
        }

        console.log("Price container updated");
      } else {
        console.error("Price container not found");
      }
    } catch (error) {
      console.error("Error updating prices:", error);
      const priceContainer = document.getElementById("live-prices");
      if (priceContainer) {
        priceContainer.innerHTML = `
          <div class="alert alert-danger" role="alert">
            Error updating prices. Please try again later.
          </div>
        `;
      }
    }
  };

  // Add custom styles
  const style = document.createElement("style");
  style.textContent = `
    .live-prices-grid {
        width: 100%;
        min-height: 200px;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
    .price-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1.5rem;
        width: 100%;
        max-width: 1200px;
        padding: 1rem;
    }
    .hover-card {
        transition: var(--transition);
        width: 100%;
    }
    .hover-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
    .price-section {
        padding: 10px 0;
        margin: 10px 0;
        border-top: 1px solid rgba(0,0,0,0.05);
        border-bottom: 1px solid rgba(0,0,0,0.05);
    }
    .inr-price {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--primary-color);
        text-align: center;
        margin: 8px 0;
    }
    .card {
        background: var(--white);
        border-radius: 10px;
        height: 100%;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        transition: var(--transition);
        overflow: hidden;
    }
    .card-body {
        padding: 1.2rem;
    }
    .card-title {
        font-size: 1.2rem;
        margin-bottom: 0.3rem;
        color: var(--primary-color);
        font-weight: 600;
    }
    .card-subtitle {
        font-size: 0.9rem;
        margin-bottom: 0.8rem;
        color: var(--text-color);
        font-weight: 500;
    }
    .timestamp {
        font-size: 0.8rem;
        color: var(--secondary-color);
        text-align: center;
        margin-top: 10px;
        padding-top: 8px;
        border-top: 1px solid rgba(0,0,0,0.05);
    }
    .unit-selector {
        text-align: left;
        margin-bottom: 2rem;
        padding: 0;
        width: 100%;
        max-width: 300px;
    }
    .form-label {
        font-size: 1.1rem;
        color: var(--primary-color);
        font-weight: 600;
        margin-bottom: 0.5rem;
        display: block;
    }
    .form-select {
        border-radius: 8px;
        border: 2px solid #e0e0e0;
        padding: 0.8rem 1.2rem;
        font-size: 1.1rem;
        color: var(--primary-color);
        background-color: var(--white);
        transition: var(--transition);
        cursor: pointer;
        width: 100%;
        appearance: none;
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231a237e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: right 1rem center;
        background-size: 1.2em;
    }
    .form-select:hover {
        border-color: var(--primary-color);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .form-select:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(26, 35, 126, 0.1);
        outline: none;
    }
    .alert {
        border-radius: 10px;
        padding: 1.2rem;
        margin: 1rem 0;
        background: #ffebee;
        color: #c62828;
        border: none;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        text-align: center;
        font-weight: 500;
    }
    @media (max-width: 768px) {
        .live-prices-grid {
            padding: 1rem;
        }
        .price-container {
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 1rem;
        }
        .unit-selector {
            margin: 1rem 0;
            max-width: 100%;
        }
        .card-body {
            padding: 1rem;
        }
    }
  `;
  document.head.appendChild(style);

  // Initial update with default unit (g)
  console.log("Starting initial update...");
  updatePrices("g");

  // Update prices every 5 minutes
  setInterval(() => {
    const unitSelect = document.getElementById("unitSelect");
    const currentUnit = unitSelect ? unitSelect.value : "g";
    updatePrices(currentUnit);
  }, 5 * 60 * 1000);
});
