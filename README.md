# Usage

**Run the backend first**

    npm install (all dependencies are installed)

    npm start (starts the backend at localhost:3001)

**Running the frontend**

    npm install (all dependencies are installed)

    npm start (starts the frontend at localhost:3000)


# Tech Stack

**Backend**
  
    NodeJs, Express

    Cheerio for scraping

**Frontend**

    ReactJs
    
    
# Interactive Elements

    Data Grid with filter and sorting capabilities
    Ability to refresh data
    Option to Export data as CSV

# Recommended Improvements
  
    - Add Scraping of JOC.com website --> Currently not included
    - Add modularity in backend for scraping, can have one function which is called depending on each website
    - Error handling has not been implemented in case of bad response from backend; Hence this will be a major improvement
    - Database for storing the headlines
    - Frontend can be improved in styling
    - Unit testing of scraping function can be conducted prior to pulling data from backend
