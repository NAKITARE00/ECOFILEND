// Previous stored pm10 value
let previousPm10 = 0; // Initialize with a default value

// This function gets details about Star Wars characters. This example showcases usage of HTTP requests and console.logs.
const eventId = args[0];

// Execute the API request (Promise)
const apiResponse = await Functions.makeHttpRequest({
    url: `https://api.openaq.org/v2/latest/${eventId}?limit=100&page=1&offset=0&sort=asc`
});

if (apiResponse.error) {
    console.error(apiResponse.error);
    throw new Error("Request failed");
}

// Extract the measurements with "pm" in their parameter
const results = apiResponse.results || [];
const measurements = results.length > 0 ? results[0].measurements || [] : [];

// Extract PM measurements and get the latest value
const pmMeasurements = measurements.filter(
    (measurement) => measurement.parameter.startsWith("pm")
);

// Find the latest measurement value
const latestMeasurement = pmMeasurements.length > 0
    ? Math.max(...pmMeasurements.map((measurement) => measurement.value))
    : 0;

// Check if the latest measurement is greater than the previous measurement
if (latestMeasurement > previousPm10) {
    previousPm10 = latestMeasurement; // Update the previous measurement value
    return Functions.encodeString("Monthly Grant Failed");
} else {
    return Functions.encodeString("Monthly Grant Success");
}
