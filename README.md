## RouteWise Frontend
RouteWise Frontend is built using React JavaScript based on designs created using Figma. The frontend creates a web interface with several apis and integrated backend structure for users to create an account, and create full trips to desired destinations, with places provisioned by Google Places API, sorted in an optimized itinerary based on a sophisticated algorithm stored in the backend.

## Tech Stack
React JavaScript (Vite)
Raw CSS
Hosted on [Vercel](https://vercel.com/)

## APIs
Google Maps JavaScript, Google Places, Google Places (New), Google Place Details, Google Geocoding, Google Photos.



## How to run and test 
1. Navigate to the root folder 'ROUTEWISE' and install the dependencies.

    ``` 
    npm install
    npm install react-router-dom
    ```

2. Create a `.env` file in the root directory and add the following ('****' should be replaced a working Google API Key that has Google Places, Places (New), Geocoding, Maps JavaScript, Place Details, and Photos API enabled):

    ```
    VITE_APP_GOOGLE_API_KEY = '****'
    ```

3. Open the terminal and use the following command prompt to start the application:

    ```
    npm run dev
    ```