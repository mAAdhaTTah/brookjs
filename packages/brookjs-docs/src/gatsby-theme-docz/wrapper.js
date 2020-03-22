import * as React from 'react';

const Wrapper = ({ children }) => {
  React.useEffect(() => {
    for (const iframe of document.querySelectorAll(
      'iframe.embedded-codesandbox'
    )) {
      iframe.style.width = '100%';
      iframe.style.height = '600px';
    }
  }, [children]);

  return <React.Fragment>{children}</React.Fragment>;
};
export default Wrapper;
