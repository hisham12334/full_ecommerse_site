import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, isInitializing } = useAuth();

    if (isInitializing) {
        return <div>Loading...</div>; // Or a proper loading spinner
    }

    if (!user || user.role !== 'admin') {
        // Redirect them to the home page if they are not an admin
        return <Navigate to="/" />;
    }

    return children;
};

export default AdminRoute;