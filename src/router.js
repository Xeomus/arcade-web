const DEFAULT_ROUTE = "/";

function normalizePath(path) {
  if (!path) {
    return DEFAULT_ROUTE;
  }
  if (path.startsWith("#")) {
    return path.slice(1) || DEFAULT_ROUTE;
  }
  return path.startsWith("/") ? path : `/${path}`;
}

function getHashPath() {
  return normalizePath(window.location.hash);
}

export function navigate(path) {
  const normalized = normalizePath(path);
  if (window.location.hash.slice(1) === normalized) {
    return;
  }
  window.location.hash = normalized;
}

export function createRouter({ outlet, routes, onRouteChange }) {
  if (!outlet) {
    throw new Error("Router necesita un elemento outlet.");
  }

  let activeRoute = null;

  const renderRoute = () => {
    const path = getHashPath();
    const route = routes[path] || routes["/404"] || routes[DEFAULT_ROUTE];

    if (activeRoute && activeRoute.onLeave) {
      activeRoute.onLeave();
    }

    outlet.innerHTML = route.render();

    if (route.onMount) {
      route.onMount();
    }

    if (onRouteChange) {
      onRouteChange(path);
    }

    activeRoute = route;
  };

  window.addEventListener("hashchange", renderRoute);
  window.addEventListener("load", renderRoute);

  return {
    start: renderRoute,
  };
}
