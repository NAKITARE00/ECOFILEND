const city = args[0];
const state = args[1];
const country = args[2];
const apiKey = secrets.IQAIRAPI;


// Execute the API request (Promise)
const apiResponse = await Functions.makeHttpRequest({
    url: `https://api.airvisual.com/v2/city?city=${city}&state=${state}&country=${country}&key=${apiKey}`,
});

console.log(JSON.stringify(apiResponse));
// Check if the response contains valid data
if (apiResponse.data && apiResponse.data.data && apiResponse.data.data.current && apiResponse.data.data.current.pollution) {
    // Extract the aqius value
    const aqius = apiResponse.data.data.current.pollution.aqius || 0;
    console.log(aqius);

    return Functions.encodeInt256(aqius);
} else {
    console.error('Invalid or missing data in the API response.');
    return 0;
}



