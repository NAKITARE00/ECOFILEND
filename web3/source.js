const city = args[0];
const state = args[1];
const country = args[2];

    const apiResponse = await Functions.makeHttpRequest({
        method: 'GET',
        url: `https://api.airvisual.com/v2/city?city=${city}&state=${state}&country=${country}&key=a156c632-e69e-424e-950b-89dceff510b8`,
    });

    console.log(JSON.stringify(apiResponse));
    
    if (apiResponse.data && apiResponse.data.data && apiResponse.data.data.current && apiResponse.data.data.current.pollution) {
    const aqius = apiResponse.data.data.current.pollution.aqius || 0;
    console.log(aqius);
    const aqicn = apiResponse.data.data.current.pollution.aqicn ||0;
    const data = [aqius, aqicn]; 

    return Functions.encodeUint256(aqius);
   } 
   else {
    console.error('Invalid or missing data in the API response.');
    return (0);
   }
    


