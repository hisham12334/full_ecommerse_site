import React from 'react';

export const ProductRowSkeleton = () => (
  <div className="p-4 border-b flex items-center justify-between animate-pulse">
    <div className="flex items-center min-w-0 flex-1">
      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gray-200 rounded flex-shrink-0"></div>
      <div className="ml-3 lg:ml-4 min-w-0 flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
    <div className="flex gap-1 lg:gap-2 flex-shrink-0 ml-2">
      <div className="w-10 h-10 bg-gray-200 rounded"></div>
      <div className="w-10 h-10 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export const OrderRowSkeleton = () => (
  <div className="p-4 border-b animate-pulse">
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
      </div>
      <div className="text-right">
        <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  </div>
);

export const UserRowSkeleton = () => (
  <div className="p-4 border-b flex items-center justify-between animate-pulse">
    <div className="flex items-center flex-1">
      <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
      <div className="ml-3 flex-1">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
    <div className="flex gap-2">
      <div className="w-16 h-6 bg-gray-200 rounded"></div>
      <div className="w-8 h-8 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export const AdminSkeletonList = ({ type, count = 5 }) => {
  const SkeletonComponent = {
    products: ProductRowSkeleton,
    orders: OrderRowSkeleton,
    users: UserRowSkeleton
  }[type] || ProductRowSkeleton;

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 lg:p-6 border-b">
        <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
      </div>
      <div>
        {Array.from({ length: count }).map((_, index) => (
          <SkeletonComponent key={index} />
        ))}
      </div>
    </div>
  );
};

export default AdminSkeletonList;