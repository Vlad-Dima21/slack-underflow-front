import React from "react";
export default async function ({ method, bearer, url, body }) {
    const headers = { 'Content-Type': 'application/json'};
    !!bearer && (headers['Authorization'] = `Bearer ${bearer}`);

    const response = await fetch(url, {
        method,
        headers,
        body
    });
    return response;
}