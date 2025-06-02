import React, {useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import useUserStore from '../../store/userStore';
import {FlashMessageContext} from '../../utils/flashMessageContext';
import axiosInstance from '../../api/axiosInstance';
import {
  IconCurrencyDollar,
  IconCurrencyRupee,
  IconEdit,
  IconHash,
  IconMapPin,
  IconTax,
  IconTrash,
  IconWorld,
} from '@tabler/icons-react';
import '../../rating.css';

// Component imports
import PriceDisplay from '../../components/ui/listing/PriceDisplay';
import OwnerInfo from '../../components/ui/listing/OwnerInfo';
import Review from '../../components/ui/listing/Review';
import {deleteListing} from '../../api/index.js';

const ADMIN_ID = '66a343a50ff99cdefc1a4657';

const ListingDetail = () => {
  const navigate = useNavigate();
  const {id} = useParams();
  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingListing, setIsDeletingListing] = useState(false);
  const [showWithTax, setShowWithTax] = useState(false);
  const [displayCurrency, setDisplayCurrency] = useState('USD');

  const {currUser, checkCurrUser} = useUserStore();
  const {showErrorMessage, showSuccessMessage} = useContext(FlashMessageContext);
  
  useEffect(() => {
    const fetchListingDetails = async () => {
      if (!currUser) await checkCurrUser();
      setIsLoading(true);

      try {
        const response = await axiosInstance.get(`/listings/${id}`);
        const result = response.data;
        const listingData = result.success ? result.data : result;
        
        if (listingData) {
          setListing(listingData);
          setReviews(listingData.reviews || []);
        } else {
          showErrorMessage('Listing not found');
          navigate('/listings');
        }
      } catch (error) {
        console.error('Error:', error);
        showErrorMessage(error.response?.data?.message || error.message || 'Failed to load listing');
        navigate('/listings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchListingDetails();
  }, [id, currUser]);

  const handleDelete = async () => {
    setIsDeletingListing(true);

    try {
      await deleteListing(id);

      showSuccessMessage('Listing deleted successfully');
      navigate('/listings');
    } catch (error) {
      showErrorMessage(error.message || 'Failed to delete listing');
    } finally {
      setIsDeletingListing(false);
    }
  };

  const handleReviewUpdate = (updatedReviews) => {
    setReviews(updatedReviews);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"/>
      </div>
    );
  }

  const canModifyListing = Boolean(
    currUser &&
    (currUser.userId === listing?.owner?._id || currUser.userId === ADMIN_ID),
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {listing?.image && (
          <div className="relative">
            <img
              src={listing.image.url}
              alt={listing.title}
              className="w-full h-[400px] object-cover"
            />
          </div>
        )}

        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold">
              {listing?.title}
            </h1>

            <div className="flex items-center gap-1">
              <div className="flex border rounded-md overflow-hidden">
                <button
                  onClick={() => setDisplayCurrency('INR')}
                  className={`p-1.5 sm:px-2 sm:py-1 flex items-center gap-1 text-xs ${displayCurrency === 'INR' ? 'bg-gray-100 font-medium' : 'bg-white'}`}
                  title="Show in Rupees"
                >
                  <IconCurrencyRupee size={16}/>
                  <span className="hidden sm:inline">INR</span>
                </button>
                <button
                  onClick={() => setDisplayCurrency('USD')}
                  className={`p-1.5 sm:px-2 sm:py-1 flex items-center gap-1 text-xs ${displayCurrency === 'USD' ? 'bg-gray-100 font-medium' : 'bg-white'}`}
                  title="Show in Dollars"
                >
                  <IconCurrencyDollar size={16}/>
                  <span className="hidden sm:inline">USD</span>
                </button>
              </div>

              <button
                onClick={() => setShowWithTax(!showWithTax)}
                className={`p-1.5 rounded-md border flex items-center justify-center ${showWithTax ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}
                title={showWithTax ? 'Price includes tax' : 'Price excludes tax'}
              >
                <IconTax size={18} className={showWithTax ? 'text-blue-500' : 'text-gray-400'}/>
              </button>
            </div>
          </div>

          <OwnerInfo
            owner={listing?.owner}
            listingTitle={listing?.title}
            canModifyListing={canModifyListing}
          />

          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">About this place</h2>
            <p className="text-gray-700">{listing?.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <h2 className="text-lg font-medium mb-2">Location</h2>
              <div className="flex items-center gap-2">
                <IconMapPin className="text-gray-500"/>
                <span>{listing?.location}</span>
              </div>

              <div className="flex items-center gap-2">
                <IconWorld className="text-gray-500"/>
                <span>{listing?.country}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-medium mb-2">Price</h2>
              {listing?.price && (
                <PriceDisplay
                  price={listing.price}
                  showWithTax={showWithTax}
                  displayCurrency={displayCurrency}
                />
              )}
            </div>
          </div>

          {listing?.tags?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-2">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {listing.tags.filter((tag) => tag !== 'null').map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    <IconHash size={16}/>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {canModifyListing && (
            <div className="flex gap-4 mt-8 pt-4 border-t">
              <button
                onClick={() => navigate(`/listings/${id}/edit`, { state: listing })}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <IconEdit size={20}/>
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeletingListing}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                <IconTrash size={20}/>
                {isDeletingListing ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Review Component */}
      <Review
        listingId={id}
        initialReviews={reviews}
        onReviewUpdate={handleReviewUpdate}
      />
    </div>
  );
};

export default ListingDetail;
