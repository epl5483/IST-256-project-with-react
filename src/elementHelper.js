// Helper function to make React.createElement cleaner when dealing with multiple children
export function el(type, props = null, ...children) {
  // Filter out falsy values (false, null, undefined) from children
  const filteredChildren = children.flat().filter(child => child !== false && child !== null && child !== undefined);
  
  if (filteredChildren.length === 0) {
    return React.createElement(type, props);
  } else if (filteredChildren.length === 1) {
    return React.createElement(type, props, filteredChildren[0]);
  } else {
    return React.createElement(type, props, filteredChildren);
  }
}
