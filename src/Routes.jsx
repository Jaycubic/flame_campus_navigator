import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import CampusNavigationMap from "pages/campus-navigation-map";
import DestinationSearchSelection from "pages/destination-search-selection";
import GpsPermissionSetup from "pages/gps-permission-setup";
import SettingsPreferences from "pages/settings-preferences";
import NavigationActiveState from "pages/navigation-active-state";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<CampusNavigationMap />} />
        <Route path="/campus-navigation-map" element={<CampusNavigationMap />} />
        <Route path="/destination-search-selection" element={<DestinationSearchSelection />} />
        <Route path="/gps-permission-setup" element={<GpsPermissionSetup />} />
        <Route path="/settings-preferences" element={<SettingsPreferences />} />
        <Route path="/navigation-active-state" element={<NavigationActiveState />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;