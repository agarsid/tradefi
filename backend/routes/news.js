const scrapeData = require('../utils/scrape');

const userRoutes = (app, fs) => {
  const dataPath = "./data/news.json";

  const readFile = (
    callback,
    returnJson = false,
    filePath = dataPath,
    encoding = "utf8"
  ) => {
    fs.readFile(filePath, encoding, (err, data) => {
      if (err) {
        throw err;
      }

      callback(returnJson ? JSON.parse(data) : data);
    });
  };

  const writeFile = (
    fileData,
    callback,
    filePath = dataPath,
    encoding = "utf8"
  ) => {
    fs.writeFile(filePath, fileData, encoding, (err) => {
      if (err) {
        throw err;
      }

      callback();
    });
  };

  app.get("/news", (req, res) => {
    readFile((data) => {
      res.send(data);
    }, true);
  });

  app.get("/new-news",async (req, res) => {
      
      const data = await scrapeData()
      // res.send(data)

      writeFile(JSON.stringify(data, null, 2), () => {
        res.send(data);
      });
  });
}

module.exports = userRoutes;
