const Listing = require('../models/listing.js');
const { formatResponse } = require('../utilities/errorHandler');

// Index: Get all listings
module.exports.index = async (req, res) => {
    try {
        console.log('Request received for listings');
        console.log('Headers:', req.headers);
        const listings = await Listing.find({}).populate('owner');
        console.log(`Found ${listings.length} listings`);
        console.log('Sending response');
        res.json(formatResponse(true, 'Listings retrieved successfully', listings));
    } catch (e) {
        console.error('Error in index controller:', e);
        res.status(500).json(formatResponse(false, 'Error getting listings', null, e.message));
    }
};

// Search listings by query
module.exports.searchListings = (req, res) => {
    const { query } = req.query;

    if (!query || query.trim() === '') {
        return this.index(req, res);
    }

    const searchRegex = new RegExp(query, 'i');

    Listing.find({
        $or: [
            { title: searchRegex },
            { description: searchRegex },
            { location: searchRegex },
            { country: searchRegex },
            { tags: searchRegex },
        ],
    })
    .populate('owner')
    .then(listings => {
        res.json(listings);
    })
    .catch(err => {
        res.status(500).json({
            message: 'Error searching listings',
            error: err.message,
        });
    });
};

// Show a specific listing
module.exports.singleListing = async (req, res) => {
    const { id } = req.params;
    try {
        console.log('Fetching listing with ID:', id);
        const listing = await Listing.findById(id)
            .populate({
                path: 'reviews',
                populate: {
                    path: 'owner',
                    select: 'name email profilePhoto'
                },
            })
            .populate({
                path: 'owner',
                select: 'name email profilePhoto'
            });
        
        if (!listing) {
            console.log('Listing not found');
            return res.status(404).json(formatResponse(false, 'Listing not found'));
        }

        // Debug log to check owner data
        // console.log('Listing owner data:', {
        //     id: listing.owner?._id,
        //     name: listing.owner?.name,
        //     email: listing.owner?.email,
        //     profilePhoto: listing.owner?.profilePhoto
        // });
        
        if (!listing.owner) {
            console.log('Owner data missing');
            return res.status(400).json(formatResponse(false, 'Owner data missing'));
        }
        
        res.json(formatResponse(true, 'Listing retrieved successfully', listing));
    } catch (error) {
        console.error('Error in singleListing:', error);
        res.status(500).json(formatResponse(false, 'Error retrieving listing', null, error.message));
    }
};

// Create a new listing
module.exports.createListing = async (req, res) => {
    try {
        const {
            title,
            description,
            price,
            location,
            country,
            tagsArray,
        } = req.body;

        const image = {
            url: req.body.image,
            filename: 'listingimage',
        };

        const newListing = new Listing({
            title,
            description,
            image,
            price,
            location,
            country,
            tags: tagsArray || '[]',
            owner: req.user.userId, // Set owner to the logged-in user
        });

        const savedListing = await newListing.save();
        const populatedListing = await Listing.findById(savedListing._id).populate('owner');
        
        res.status(201).json(formatResponse(true, "Successfully added", populatedListing));
    } catch (error) {
        console.error("Error creating listing:", error);
        res.status(500).json({
            message: 'Error creating listing',
            error: error.message,
        });
    }
};

// Update a listing
module.exports.updateListing = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            price,
            location,
            country,
            tagsArray,
        } = req.body;

        const image = {
            url: req.body.image,
            filename: 'listingimage',
        };

        const updates = {
            title,
            description,
            image,
            price,
            location,
            country,
            tags: tagsArray,
        };

        const updatedListing = await Listing.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        ).populate('owner');

        if (!updatedListing) {
            return res.status(404).json({
                message: 'Listing not found',
            });
        }

        res.json(formatResponse(true, "Successfully Updated", updatedListing));
    } catch (error) {
        console.error("Error updating listing:", error);
        res.status(500).json({
            message: 'Error updating listing',
            error: error.message,
        });
    }
};

// Delete a listing
module.exports.destroyListing = async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await Listing.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({
                message: 'Listing not found',
            });
        }

        res.json({
            message: 'Listing Deleted',
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting listing',
            error: error.message,
        });
    }
};
