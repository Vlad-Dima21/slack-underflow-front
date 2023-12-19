import React from 'react';

const LoadingWrapper = ({loadingState, children}) => {
    return (
        loadingState ? <div className="lds-ripple self-center"><div></div><div></div></div> : <>{children}</>
    );
}

export default LoadingWrapper;