// Constants for price calculation
export const TAX_RATE = 0.18; // 18% GST
export const USD_TO_INR_RATE = 83.5; // 1 USD = 83.5 INR (approx)

// Calculate price with tax if needed
export const calculatePriceWithTax = (price, includeTax = false) => {
    return includeTax ? (price + price * TAX_RATE) : price;
};

// Convert USD to INR
export const convertUSDtoINR = (price) => {
    return price * USD_TO_INR_RATE;
};

// Format price based on currency
export const formatPrice = (price, currency = 'USD') => {
    const symbol = currency === 'USD' ? '$' : '₹';
    const absPrice = Math.abs(price);
    const sign = price < 0 ? '-' : '';
    return `${sign}${symbol}${absPrice.toLocaleString('en-US')}`;
};

export const convertCurrency = (amount, fromCurrency, toCurrency, rate = USD_TO_INR_RATE) => {
    if (fromCurrency === toCurrency) return amount;
    if (fromCurrency === 'USD' && toCurrency === 'INR') {
        return Math.round(amount * rate);
    }
    if (fromCurrency === 'INR' && toCurrency === 'USD') {
        return Math.round(amount / rate);
    }
    return amount;
};