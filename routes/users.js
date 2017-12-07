var express = require('express');
var fs = require('fs');
var router = express.Router();

/* add a new user 
  Input:
    {
      username: xxx
      password: xxx
    }
*/
router.post('/add', function(req, res, next) {
  var username = req.body.username;

  var userFilePath = "./data/" + username + ".json";
  var isExist = fs.existsSync(userFilePath);

  if (!isExist) {
    var userInfo = {
      username: req.body.username,
      password: req.body.password,
      record: 0
    };

    fs.writeFileSync(userFilePath, JSON.stringify(userInfo));

    res.send(JSON.stringify({status: 0}));
  } else {
    res.send(JSON.stringify({
      status: 1,
      message: "The UserName is Exist!"
    }))
  }
});

/* user Logon
  Input:
    {
      username: xxx
      password: xxx
    }

  OutPut:
    {
      username: xxx
      record: xxx
    }
*/
router.post('/logon', function(req, res, next) {
  var username = req.body.username;
  
  var userFilePath = "./data/" + username + ".json";
  var worldRecordPath = './data/worldRecord.json';
  var isExist = fs.existsSync(userFilePath);

  if (isExist) {
    var userInfo = JSON.parse(fs.readFileSync(userFilePath));
    var worldRecordInfo = JSON.parse(fs.readFileSync(worldRecordPath));
    
    if (userInfo.password !== req.body.password) {
      res.send(JSON.stringify({
        status: 1,
        message: "Incorrect username or password."
      }))
    } else {
      res.send(JSON.stringify({status: 0, data: {
        username: userInfo.username,
        userrecord: userInfo.record,
        worldrecord: worldRecordInfo[0] ? worldRecordInfo[0].record : 0
      }}));
    }
  } else {
    res.send(JSON.stringify({
      status: 1,
      message: "Incorrect username or password."
    }))
  }
});

/* update record 
  {
    username: xxx
    record: xxx
  }
*/
router.put('/update', function(req, res, next) {
  var username = req.body.username;
  
  var userFilePath =  "./data/" + username + ".json";
  var worldRecordPath = './data/worldRecord.json';
  var isExist = fs.existsSync(userFilePath);

  if (isExist) {
    var userInfo = JSON.parse(fs.readFileSync(userFilePath));
    var worldRecordInfo = JSON.parse(fs.readFileSync(worldRecordPath));
    
    // update user record
    if (userInfo.record === 0 || userInfo.record > req.body.record) {
      userInfo.record = req.body.record;
      fs.writeFileSync(userFilePath, JSON.stringify(userInfo));    
    }

    // update world record
    if (worldRecordInfo.length === 0) {
      worldRecordInfo.unshift({
        username: req.body.username,
        record: req.body.record
      })

      fs.writeFileSync(worldRecordPath, JSON.stringify(worldRecordInfo.slice(0,6)));
    } else {
      var userIndex = worldRecordInfo.findIndex((Info) => Info.username == req.body.username);

      if (userIndex !== -1) {
        if (worldRecordInfo[userIndex].record > req.body.record) {
          worldRecordInfo[userIndex].record = req.body.record;
          worldRecordInfo.sort((a,b) => a.record - b.record);
          fs.writeFileSync(worldRecordPath, JSON.stringify(worldRecordInfo.slice(0,6)));
        }
      } else {
        var index = worldRecordInfo.findIndex((Info) => Info.record > req.body.record);
        if (index !== -1) {
          worldRecordInfo.splice(index, 0, {
            username: req.body.username,
            record: req.body.record
          });
        } else {
          worldRecordInfo.push({
            username: req.body.username,
            record: req.body.record
          })
        }
        fs.writeFileSync(worldRecordPath, JSON.stringify(worldRecordInfo.slice(0,6)));
      }
    }

    res.send(JSON.stringify({status: 0, data: {username: userInfo.username, record: userInfo.record}}));
  } else {
    res.send(JSON.stringify({
      status: 1,
      message: "Server error!"
    }))
  }
});

/* get user record
  /record?username=xxx

*/
router.get('/record', function(req, res){  
  var username = req.query.username;
  var userFilePath = "./data/" + username + ".json";
  var isExist = fs.existsSync(userFilePath);
  console.log('name:',req.query);
  if (isExist) {
    var userInfo = JSON.parse(fs.readFileSync(userFilePath));    

    res.send(JSON.stringify({status: 0, data: {
        username: userInfo.username,
        userrecord: userInfo.record
      }}
    ));
  } else {
    res.send(JSON.stringify({
      status: 1,
      message: "Incorrect username."
    }))
  }
});

module.exports = router;
