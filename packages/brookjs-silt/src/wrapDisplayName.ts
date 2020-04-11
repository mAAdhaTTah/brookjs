const getDisplayName = function (Component: React.ComponentType<any> | string) {
  if (typeof Component === 'string') {
    return Component;
  }

  return Component.displayName || Component.name || 'Component';
};

export const wrapDisplayName = (
  BaseComponent: React.ComponentType<any> | string,
  hocName: string,
) => hocName + '(' + getDisplayName(BaseComponent) + ')';
