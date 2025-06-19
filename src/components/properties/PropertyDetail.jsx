import { useState } from "react";
import { FiArrowLeft, FiUser, FiHome, FiMapPin, FiDollarSign } from "react-icons/fi";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function PropertyDetail({ property, tenants, onBack }) {
  const data = property;
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

  const tenantList = Array.isArray(data.tenant)
  ? data.tenant
      .map((propertyTenant) => tenants.find((t) => t.id === propertyTenant.tenantId))
      .filter(Boolean)
  : [];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
      <button 
        onClick={onBack}
        className="flex items-center text-blue-600 dark:text-blue-400 mb-4 p-4"
      >
        <FiArrowLeft className="mr-2" />
        Back to Properties
      </button>

      <div className="p-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{data.name}</h2>
        <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
          <FiMapPin className="mr-2" />
          <span>{data.address}, {data.location?.city}, {data.location?.state}</span>
        </div>

        {/* Image Carousel Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Property Images</h3>
          {data.image_list?.length > 0 ? (
            <div className="max-w-2xl mx-auto">
              <Slider {...carouselSettings}>
                {data.image_list.map((image, index) => (
                  <div key={index} className="h-64 md:h-96">
                    <img 
                      src={image.urls[0]} 
                      alt={`Property ${index + 1}`} 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </Slider>
            </div>
          ) : (
            <div className="bg-gray-100 dark:bg-gray-800 h-64 flex items-center justify-center rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">No images available</p>
            </div>
          )}
        </div>

        {/* Property Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Property Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Type:</span>
                <span className="text-gray-800 dark:text-white">{data.apartmentType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Status:</span>
                <span className="text-gray-800 dark:text-white">{data.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Bedrooms:</span>
                <span className="text-gray-800 dark:text-white">{data.number_of_bedrooms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Bathrooms:</span>
                <span className="text-gray-800 dark:text-white">{data.number_of_bath}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Year Built:</span>
                <span className="text-gray-800 dark:text-white">{data.year_built}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Price:</span>
                <span className="text-gray-800 dark:text-white">₦{data.price?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Description</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {data.description || "No description available"}
            </p>
          </div>
        </div>

        {/* Tenants Section */}
        <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Current Tenants</h3>
        {tenantList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tenantList.map((tenant, index) => (
              <div key={tenant.id || index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-3">
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full p-3 mr-3">
                    {tenant.firstname ? (
                      <span className="font-bold text-lg">
                        {tenant.firstname[0]}
                      </span>
                    ) : (
                      <FiUser size={20} />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">
                      {tenant.firstname} {tenant.lastname}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tenant</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-300 mr-2">Email:</span>
                    <span className="text-gray-800 dark:text-white">{tenant.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-300 mr-2">Phone:</span>
                    <span className="text-gray-800 dark:text-white">{tenant.phone}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-300 mr-2">Gender:</span>
                    <span className="text-gray-800 dark:text-white capitalize">{tenant.gender}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-300 mr-2">Address:</span>
                    <span className="text-gray-800 dark:text-white">{tenant.fullAddress}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
              <p className="text-gray-600 dark:text-gray-400">No tenants currently assigned</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}