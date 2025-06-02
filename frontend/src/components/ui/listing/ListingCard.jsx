import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  IconCurrencyDollar,
  IconCurrencyRupee,
  IconHash,
  IconMapPin,
  IconWorld,
} from '@tabler/icons-react';

const TAX_RATE = 0.18; // 18% GST
const USD_TO_INR_RATE = 83.5; // 1 USD = 83.5 INR (approx)

const PriceDisplay = ({
  price,
  showWithTax = false,
  displayCurrency = 'USD',
}) => {
  // Calculate price with tax if needed
  const priceWithTax = showWithTax ? (price + price * TAX_RATE) : price;

  // All prices in DB are in USD, convert to INR if needed
  let displayPrice = priceWithTax;
  if (displayCurrency === 'INR') {
    displayPrice = priceWithTax * USD_TO_INR_RATE;
  }

  // Format the price based on currency
  const formattedPrice = displayCurrency === 'USD'
      ? displayPrice.toLocaleString('en-US', {maximumFractionDigits: 2})
      : Math.round(displayPrice).toLocaleString('en-IN');

  // Currency icon
  const CurrencyIcon = displayCurrency === 'USD'
      ? IconCurrencyDollar
      : IconCurrencyRupee;

  return (
      <div className="flex items-center gap-1">
        <CurrencyIcon size={18} className="text-gray-600 flex-shrink-0"/>
        <span className="font-medium">{formattedPrice}</span>
        {showWithTax && (
            <span className="text-xs text-gray-500 ml-1">(Incl. tax)</span>
        )}
      </div>
  );
};

PriceDisplay.propTypes = {
  price: PropTypes.number.isRequired,
  showWithTax: PropTypes.bool,
  displayCurrency: PropTypes.string,
};

const ListingCard = ({
  listing,
  showWithTax = false,
  displayCurrency = 'USD',
}) => {
  return (
      <div
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
        <Link to={`/listings/${listing._id}`} className="block">
          <img
              src={listing.image.url}
              className="w-full h-64 object-cover hover:opacity-90 transition-opacity"
              alt={listing.title}
              loading="lazy"
          />
          <div className="p-4">
            <h5 className="text-xl font-semibold mb-2">{listing.title}</h5>
            <div className="space-y-3">
              <PriceDisplay
                  price={listing.price}
                  showWithTax={showWithTax}
                  displayCurrency={displayCurrency}
              />

              <div className="flex items-center gap-2">
                <IconMapPin size={20} className="flex-shrink-0"/>
                <span className="truncate">{listing.location}</span>
              </div>

              {listing.country && (
                  <div className="flex items-center gap-2">
                    <IconWorld size={20} className="flex-shrink-0"/>
                    <span className="truncate">{listing.country}</span>
                  </div>
              )}

              {listing.tags && listing.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {listing.tags.filter((tag) => tag !== 'null' && tag).
                        slice(0, 3) // Limit to first 3 tags
                        .map((tag) => (
                            <span
                                key={tag}
                                className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full flex items-center gap-1 text-sm"
                            >
                      <IconHash size={14}/>
                              {tag}
                    </span>
                        ))}
                    {listing.tags.filter(t => t !== 'null' && t).length > 3 && (
                        <span
                            className="text-sm text-gray-500">+{listing.tags.filter(
                            t => t !== 'null' && t).length - 3} more</span>
                    )}
                  </div>
              )}
            </div>
          </div>
        </Link>
      </div>
  );
};

ListingCard.propTypes = {
  listing: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    location: PropTypes.string.isRequired,
    country: PropTypes.string,
    image: PropTypes.shape({
      url: PropTypes.string.isRequired,
    }).isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  showWithTax: PropTypes.bool,
  displayCurrency: PropTypes.string,
};

export default ListingCard;