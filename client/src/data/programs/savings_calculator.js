// Savings Calculator with a pretend exchange-rate API
// Shows how a small helper can fetch data, do the maths and give a clear answer.

const hoursSavedPerMonth = 40;
const hourlyCostInINR = 500;

// Pretend API. A real one would send live rates. This one waits a moment, like the internet does.
function fakeRatesApi() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ date: "2026-09-20", rates: { USD: 0.012, EUR: 0.011, AED: 0.044 } });
    }, 600);
  });
}

const rupees = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

const inCurrency = (amount, code) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: code, maximumFractionDigits: 0 }).format(amount);

async function main() {
  console.log("Asking the exchange-rate API for today's rates...");
  const api = await fakeRatesApi();
  console.log(`Rates received for ${api.date} (1 INR = ${api.rates.USD} USD)\n`);

  const monthly = hoursSavedPerMonth * hourlyCostInINR;
  const yearly = monthly * 12;

  console.log(`Time saved:            ${hoursSavedPerMonth} hours every month`);
  console.log(`Money saved per month: ${rupees(monthly)}`);
  console.log(`Money saved per year:  ${rupees(yearly)}\n`);

  console.log("The same yearly saving in other currencies:");
  for (const [code, rate] of Object.entries(api.rates)) {
    console.log(`  ${code}: ${inCurrency(yearly * rate, code)}`);
  }

  if (yearly >= 100000) {
    console.log(`\nThat is about ${(yearly / 100000).toFixed(1)} lakh rupees a year.`);
  }
}

// "await" keeps the program running until the answer arrives.
await main();
