// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================

var friendsData = require("../data/friends");
var bestMatch;

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {
  // API GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases when a user visits a link
  // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
  // ---------------------------------------------------------------------------

  app.get("/api/friends", function(req, res) {
    res.json(friendsData);
  });

  // API POST Requests
  // Below code handles when a user submits a form and thus submits data to the server.
  // In each of the below cases, when a user submits form data (a JSON object)
  // ...the JSON is pushed to the appropriate JavaScript array
  // (ex. User fills out a reservation request... this data is then sent to the server...
  // Then the server saves the data to the tableData array)
  // ---------------------------------------------------------------------------

  app.post("/api/friends", function(req, res) {
    var newFriendScore = req.body.scores;
    var totalDifferences = [];

    // Find totalDifference
    // Take the scores from the user and from each possible friend to find how close they are
    // Loop through each possible friend
    for (var i = 0; i < friendsData.length; i++) {
      var totalDifference = 0;
      // Loop through each score one at a time to find how close they are
      for (var j = 0; j < friendsData.length; j++) {
        var difference = 0;
        if (parseInt(newFriendScore[j]) > parseInt(friendsData[i].scores[j])) {
          difference =
            parseInt(newFriendScore[j]) - parseInt(friendsData[i].scores[j]);
          totalDifference += difference;
        } else {
          difference =
            parseInt(friendsData[i].scores[j]) - parseInt(newFriendScore[j]);
          totalDifference += difference;
        }
      }
      // Add each possibles friends totalDifference to an arry to be used later
      totalDifferences.push(totalDifference);
    }

    bestMatch = findSmallest(totalDifferences);

    // Return the best match as a json object
    res.json(friendsData[bestMatch]);
  });
};

function findSmallest(numbers) {
  var indexOfSmallest = 0;
  var smallestNumber = numbers[0];

  for (var i = 0; i < numbers.length; i++) {
    if (numbers[i] < smallestNumber) {
      smallestNumber = numbers[i];
      indexOfSmallest = i;
    }
  }
  return indexOfSmallest;
}
