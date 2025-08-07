import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const PropertyList = ({ 
  properties, 
  favorites, 
  onToggleFavorite, 
  className 
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatSquareFeet = (sqft) => {
    return new Intl.NumberFormat("en-US").format(sqft);
  };

  const handleFavoriteClick = (e, propertyId) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.(propertyId);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {properties.map((property) => (
        <div key={property.Id} className="bg-white rounded-xl shadow-card hover:shadow-hover transition-all duration-200">
          <Link to={`/property/${property.Id}`}>
            <div className="flex flex-col sm:flex-row">
              <div className="relative sm:w-64 sm:flex-shrink-0">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-48 sm:h-full object-cover rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none"
                />
<div className="absolute top-3 left-3 flex flex-col gap-2">
                  <Badge variant="default" className="property-type-badge">
                    {property.type}
                  </Badge>
                  {property.label && (
                    <Badge variant="secondary">
                      {property.label}
                    </Badge>
                  )}
                </div>
                <button
                  onClick={(e) => handleFavoriteClick(e, property.Id)}
                  className={cn(
                    "absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200",
                    favorites.includes(property.Id)
                      ? "bg-red-500 text-white"
                      : "bg-white/80 text-gray-600 hover:bg-white"
                  )}
                >
                  <ApperIcon 
                    name="Heart" 
                    className={cn("w-5 h-5", favorites.includes(property.Id) && "fill-current")}
                  />
                </button>
              </div>
              
              <div className="flex-1 p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-xl text-gray-900 mb-2">
                      {property.title}
                    </h3>
                    
                    <div className="price-highlight mb-3">
                      {formatPrice(property.price)}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-3 space-x-4">
                      <div className="flex items-center">
                        <ApperIcon name="Bed" className="w-4 h-4 mr-1" />
                        <span>{property.bedrooms} bed</span>
                      </div>
                      <div className="flex items-center">
                        <ApperIcon name="Bath" className="w-4 h-4 mr-1" />
                        <span>{property.bathrooms} bath</span>
                      </div>
                      <div className="flex items-center">
                        <ApperIcon name="Square" className="w-4 h-4 mr-1" />
                        <span>{formatSquareFeet(property.squareFeet)} sqft</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <ApperIcon name="MapPin" className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span>
                        {property.address.street}, {property.address.city}, {property.address.state}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 text-sm line-clamp-2 mb-3">
                      {property.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Listed {format(new Date(property.listingDate), "MMM d, yyyy")}
                      </div>
                      <div className="flex items-center text-sm text-primary hover:text-primary-600 transition-colors">
                        <span className="mr-1">View Details</span>
                        <ApperIcon name="ChevronRight" className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default PropertyList;