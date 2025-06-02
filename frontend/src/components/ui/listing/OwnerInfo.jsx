import React from 'react';
import PropTypes from 'prop-types';
import { IconUserCircle, IconMail, IconPhone, IconBrandWhatsapp, IconStar, IconClock } from '@tabler/icons-react';

const DEFAULT_OWNER_NAME = 'pramod_belagali';
const DEFAULT_OWNER_EMAIL = 'pramod@wanderlust.com';
const DEFAULT_PHONE = '+919876543210';

const OwnerInfo = ({ owner, listingTitle = '', canModifyListing }) => {
    // Debug log
    console.log('OwnerInfo received props:', { owner, listingTitle, canModifyListing });

    // Return early if no owner data at all
    if (!owner || typeof owner !== 'object') {
        console.error('No owner data provided to OwnerInfo');
        return null;
    }

    // Ensure we have required data with fallbacks
    const ownerName = owner.name || DEFAULT_OWNER_NAME;
    const ownerEmail = owner.email || DEFAULT_OWNER_EMAIL;
    const ownerPhoto = owner.profilePhoto || '';
    
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Owner Header */}
            <div className="p-6 flex items-center gap-6">
                {/* Profile Photo */}
                <div className="flex-shrink-0">
                    {ownerPhoto ? (
                        <img
                            src={ownerPhoto}
                            alt={ownerName}
                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-purple-50 flex items-center justify-center border-4 border-white shadow-lg">
                            <IconUserCircle size={48} className="text-purple-400" />
                        </div>
                    )}
                </div>

                {/* Owner Info */}
                <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-900">{ownerName}</h3>
                        <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                            <IconStar size={16} className="text-yellow-500" />
                            <span className="text-sm font-medium text-yellow-700">Superhost</span>
                        </div>
                    </div>
                    <div className="text-gray-600 flex items-center gap-2">
                        <IconClock size={16} />
                        <span>Member since {new Date().getFullYear()}</span>
                    </div>
                </div>
            </div>

            {/* Contact Options - Show all options for non-owners */}
            {!canModifyListing && (
                <div className="px-6 pb-6">
                    <div className="grid gap-3">
                        <a
                            href={`mailto:${ownerEmail}?subject=Inquiry about ${listingTitle}`}
                            className="flex items-center gap-2 px-4 py-3 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors justify-center font-medium"
                        >
                            <IconMail size={20} />
                            Contact via Email
                        </a>
                        <div className="grid grid-cols-2 gap-3">
                            <a
                                href={`https://wa.me/${DEFAULT_PHONE.replace(/[^0-9]/g, '')}?text=Hi, I'm interested in your listing: ${encodeURIComponent(listingTitle)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors justify-center font-medium"
                            >
                                <IconBrandWhatsapp size={20} />
                                WhatsApp
                            </a>
                            <a
                                href={`tel:${DEFAULT_PHONE}`}
                                className="flex items-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors justify-center font-medium"
                            >
                                <IconPhone size={20} />
                                Call
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Host Stats */}
            <div className="border-t border-gray-100">
                <div className="grid grid-cols-2 divide-x divide-gray-100">
                    <div className="p-6 text-center">
                        <div className="text-2xl font-bold text-purple-500">100%</div>
                        <div className="text-sm font-medium text-gray-500">Response Rate</div>
                    </div>
                    <div className="p-6 text-center">
                        <div className="text-2xl font-bold text-purple-500">&lt; 1 hr</div>
                        <div className="text-sm font-medium text-gray-500">Response Time</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

OwnerInfo.propTypes = {
    owner: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        email: PropTypes.string,
        profilePhoto: PropTypes.string
    }).isRequired,
    listingTitle: PropTypes.string,
    canModifyListing: PropTypes.bool.isRequired
};

export default OwnerInfo; 