const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();
const filename = "web.config";

const copyFilesToWebconfig = () => {
  try {
    const data = fs.readFileSync(`${process.env.FILE_PATH}.env`, "utf-8");
    const lines = data.split("\n");
    let output = "";
    for (line of lines) {
      if (line.charAt(0) === "#") continue; // skip comments

      if (!line.includes("=")) continue; // skip lines without =

      const entry = line.split("=");
      const key = entry[0];
      const value = (entry[1]).replace(/(?:\r\n|\r|\n)/g, "").trim();
      output += `<add key="${key.trim()}" value="${value}"/> \n`;
    }
    writeToFile(output);
  } catch (error) {
    console.log("Error", error.message);
  }
};

const writeToFile = (word) => {
  let buffer = new Buffer.from(word);

  fs.open(filename, "w", function (err, fd) {
    if (err) {
      throw "could not open file: " + err.message;
    }

    // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
    fs.write(fd, buffer, 0, buffer.length, null, function (err) {
      if (err) throw "error writing file: " + err;
      fs.close(fd, function () {
        console.log("Done. Browse "+filename);
      });
    });
  });
};
copyFilesToWebconfig();
