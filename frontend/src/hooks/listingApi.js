// hooks/useListingApi.js
import useListingStore from "../store/listing.js";
import axiosInstance from "../api/axiosInstance";

export const useListingApi = () => {
    const setListings = useListingStore((state) => state.setListings);
    const setFilterListings = useListingStore((state) => state.setFilterListings);    const getAllListings = async (setLoading) => {
        try {
            const response = await axiosInstance.get('/listings');
            const listings = response.data.success ? response.data.data : [];
            setListings(listings);
            setFilterListings(listings);
        } catch (error) {
            console.error("Error fetching listings:", error.response?.data || error.message);
            setListings([]);
            setFilterListings([]);
        } finally {
            if (setLoading) {
                setLoading(false);
            }
        }
    };

    return { getAllListings };
};
