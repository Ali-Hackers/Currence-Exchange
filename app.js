const apiKey = '7dad2a705db3417a828c66a668eb9d73';
const apiUrl = `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${apiKey}`;

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const button = document.getElementsByClassName("live")[0];

const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

const populateDropdowns = async () => {
  const response = await fetch(apiUrl);
  const data = await response.json();
  console.log(data);
  const currencies = Object.keys(data.rates);

  for (let select of dropdowns) {
    for (let currCode in countryList) {
      if (currencies.includes(currCode)) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
          newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "PKR") {
          newOption.selected = "selected";
        }
        select.append(newOption);
      }
    }

    select.addEventListener("change", (evt) => {
      updateFlag(evt.target);
    });
  }
};

async function updateExchangeRate() {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  const response = await fetch(apiUrl);
  const data = await response.json();
  const rates = data.rates;

  let fromRate = rates[fromCurr.value];
  let toRate = rates[toCurr.value];
  let rate = toRate / fromRate;

  let finalAmount = amtVal * rate;
  msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
}

function updateFlag(element) {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
}

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

button.addEventListener("click", () => {
  let amount = document.querySelector(".amount input").value || 1;
  let fromCurrency = fromCurr.value;
  let toCurrency = toCurr.value;

  let search = `${amount} ${fromCurrency} price in ${toCurrency}`;
  let googleSearch = `https://www.google.com/search?q=${encodeURIComponent(search)}`;

  window.location.href = googleSearch;
});

window.addEventListener("load", () => {
  populateDropdowns();
});
