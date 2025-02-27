import React, { lazy, Suspense, useMemo } from "react";

// Cache for loaded icons
const iconCache = {};

const IconLoader = ({ iconName }) => {
  const IconComponent = useMemo(() => {
    // Check if the icon is already cached
    if (!iconCache[iconName]) {
      // Dynamically import the icon and cache it
      iconCache[iconName] = lazy(() =>
        import("../Icons/index").then((module) => ({
          default: module[iconName],
        }))
      );
    }
    return iconCache[iconName];
  }, [iconName]);

  return (
    <Suspense
      fallback={
        <div className="animate-pulse bg-gray-200 rounded-xl w-[20px] h-[20px]"></div>
      }
    >
      <IconComponent />
    </Suspense>
  );
};

export default IconLoader;
