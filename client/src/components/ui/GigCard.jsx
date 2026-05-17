import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';

const GigCard = ({ gig }) => {
  const minPrice = gig.packages && gig.packages.length > 0 
    ? Math.min(...gig.packages.map(p => p.price)) 
    : 0;

  return (
    <div className="card-hover flex flex-col h-full">
      <Link to={`/gigs/${gig._id}`} className="block relative pb-[60%] overflow-hidden bg-gray-100">
        {gig.images && gig.images.length > 0 ? (
          <img src={gig.images[0]} alt={gig.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-text-muted">No Image</div>
        )}
      </Link>
      
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex items-center space-x-3 mb-3">
          <img 
            src={gig.seller?.avatar || `https://ui-avatars.com/api/?name=${gig.seller?.name}&background=2D6A4F&color=fff`} 
            alt={gig.seller?.name} 
            className="w-8 h-8 rounded-full"
          />
          <div>
            <p className="text-sm font-semibold text-text-main line-clamp-1">{gig.seller?.name}</p>
            {gig.seller?.location && (
              <p className="text-xs text-text-muted flex items-center">
                <MapPin size={10} className="mr-1" />
                {gig.seller.location.village}, {gig.seller.location.state}
              </p>
            )}
          </div>
        </div>
        
        <Link to={`/gigs/${gig._id}`} className="block mb-4 flex-grow">
          <h3 className="text-lg font-medium text-text-main leading-snug hover:text-primary transition-colors line-clamp-2">
            {gig.title}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center text-accent">
            <Star size={16} fill="currentColor" />
            <span className="font-bold text-text-main ml-1 text-sm">{gig.rating?.toFixed(1) || 'New'}</span>
            <span className="text-text-muted text-xs ml-1">({gig.totalOrders || 0})</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Starting at</p>
            <p className="text-lg font-bold text-text-main">₹{minPrice}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigCard;
