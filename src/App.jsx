import React from "react";
import Routes from "./Routes";
import LocationPermissionProvider from "./components/LocationPermissionProvider";

function App() {
  return (
    <LocationPermissionProvider>
      <Routes />
    </LocationPermissionProvider>
  );
}

export default App;