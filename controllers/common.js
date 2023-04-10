const Result = require("../utils/tool");
const express = require("express");
const router = express.Router();
const request = require("request");
let result = require("./demo.json");
router.all("/hone/statisticsReport", async (req, res) => {
  let params = req.body;
  if (Object.keys(params).length == 0) {
    params = req.query;
  }
  if (params.rangeDate) {
    params.rangeDate = JSON.parse(params.rangeDate)
  }
  let list = [];
  let data = result.data
  if (data&&data.length) {
    if (!params.lastDate && !params.rangeDate) {
      list = data;
    } else {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (params.lastDate) {
          if (params.rangeDate) {
            if (element.name>=params.lastDate&&element.name>=params.rangeDate[0]&&element.name<=params.rangeDate[1]) {
              list.push(element)  
            }
          }else{
            if (element.name>=params.lastDate){
              list.push(element)
            }
          }
        }else{
          if (element.name>=params.rangeDate[0]&&element.name<=params.rangeDate[1]) {
            list.push(element)  
          }
        }
      }
    }
  }
  res.json(
    new Result({
      data: list,
      message: "success",
    })
  );

  return;
  let url = `https://ssdm-manage-qa.ss.honeywell.com.cn/statisticsReport?type=${params.type}&env=${params.env}&timezone=UTC-5&format=yyyy-MM-dd`;
  request(
    {
      url: url, //请求路径
      method: "GET", //请求方式，默认为get
      headers: {
        //设置请求头
        "content-type": "application/json",
      },
    },
    async function (error, response, body) {
      if (!error && response.statusCode == 200) {
        let result = JSON.parse(body);
        let list = [];
        if (result.data.length) {
        }
        res.json(
          new Result({
            data: list,
            message: "success",
          })
        );
      } else {
        res.json(
          new Result({
            code: 500,
            message: "fail",
          })
        );
      }
    }
  );

  res.json({
    data: [
      { name: "Cloud", value: 146 },
      { name: "On-premise", value: 28 },
    ],
  });
});

module.exports = router;