var express = require('express');
var fs = require('fs');
var router = express.Router();

/* get world record */
router.get('', function(req, res, next) {
  var worldRecordPath = './data/worldRecord.json';
  var isExist = fs.existsSync(worldRecordPath);

  if (isExist) {
    var worldRecordInfo = JSON.parse(fs.readFileSync(worldRecordPath));

    res.send(JSON.stringify({status: 0, data: worldRecordInfo}));
  } else {
    res.send(JSON.stringify({
      status: 1,
      message: "Server error!"
    }))
  }
});

module.exports = router;
