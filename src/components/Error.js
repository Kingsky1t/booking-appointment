import React from "react";
import { useLocation } from "react-router-dom";

export const Error = () => {
    const error = useLocation().state;

    return <>{error ? <div>{error}</div> : <div>Page not Found</div>}</>;
};
