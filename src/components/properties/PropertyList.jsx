import { useState } from "react";
import { FiSearch, FiHome, FiCheckCircle, FiXCircle, FiMapPin } from "react-icons/fi";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function PropertyList({ properties, onPropertyClick }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'rent', 'sale'

  // Settings for the image carousel
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'rent' && property.status === 'RENT') ||
                         (filter === 'sale' && property.status === 'SALE');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white"></h2>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
              className="text-gray-800 dark:text-white pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="text-gray-800 dark:text-white border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Properties</option>
            <option value="rent">For Rent</option>
            <option value="sale">For Sale</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <div 
            key={property.id} 
            className="border border-gray-200 dark:border-blue-800 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onPropertyClick(property)}
          >
            {/* Image Carousel */}
            <div className="h-48 bg-gray-200 relative">
              {property.image_list?.length > 0 ? (
                <Slider {...carouselSettings}>
                  {property.image_list.map((image, index) => (
                    <div key={index}>
                      <img 
                        src={image.urls[0]} 
                        alt={`Property ${index + 1}`} 
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  ))}
                </Slider>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <FiHome className="text-gray-400 text-4xl" />
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 dark:text-white text-lg mb-1">{property.name}</h3>
              <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                <FiMapPin className="mr-1" size={14} />
                <span className="text-sm text-gray-800 dark:text-white">
                  {property.address}, {property.location?.city}, {property.location?.state}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  property.status === 'RENT' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {property.status}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300">{property.apartmentType}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="text-gray-600 dark:text-gray-300">
                  {property.number_of_bedrooms} beds • {property.number_of_bath} baths
                </div>
                <span className="font-medium text-green-600 dark:text-green-400">
                  ₦{property.price?.toLocaleString()}
                </span>
              </div>
              {property.tenant?.length > 0 && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {property.tenant.length} tenant{property.tenant.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">No properties found matching your criteria</p>
        </div>
      )}
    </div>
  );
}