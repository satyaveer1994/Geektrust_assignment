const fs = require("fs");

const filename = process.argv[2];

const moment = require("moment");

let Plans = {
  Music_streaming_subscription_plans: {
    FREE: {
      amount: 0,
      time: 1,
    },
    PERSONAL: {
      amount: 100,
      time: 1,
    },
    PREMIUM: {
      amount: 250,
      time: 3,
    },
  },
  Video_streaming_subscription_plans: {
    FREE: {
      amount: 0,
      time: 1,
    },
    PERSONAL: {
      amount: 200,
      time: 1,
    },
    PREMIUM: {
      amount: 500,
      time: 3,
    },
  },
  Podcast_streaming_subscription_plans: {
    FREE: {
      amount: 0,
      time: 1,
    },
    PERSONAL: {
      amount: 100,
      time: 1,
    },
    PREMIUM: {
      amount: 300,
      time: 2,
    },
  },
};
let top_Up = {
  FOUR_DEVICE: {
    amount: 50,
    device: 4,
  },
  TEN_DEVICE: {
    amount: 100,
    device: 10,
  },
};
let subPlan = {};
let subscription_plans_List = [];
let totalAmount = 0;
let Top_Up_List = [];
fs.readFile(filename, "utf8", (err, data) => {
  //     /*if (err) throw err
  //     var inputLines = data.toString().split("\n")
  //     // Add your code here to process input commands
  //     */

  function main(dataInput) {
    let inputLines = dataInput.toString().split("\n");

    for (i = 0; i < inputLines.length; i++) {
      if (inputLines) {
        let input = inputLines[i].split(" ");

        if (input[0] === "START_SUBSCRIPTION") {
          addDate(input[1].trim());
        } else if (input[0] === "ADD_SUBSCRIPTION") {
          subScrip(input[1], input[2]);
        } else if (input[0] === "ADD_top_Up") {
          addTop(input[1], input[2]);
        } else if (input[0] === "PRINT_RENEWAL_DETAILS") {
          printInfo();
        }
      }
    }
  }

  const printInfo = () => {
    if (subscription_plans_List.length === 0) {
      console.log("SUBSCRIPTIONS_NOT_FOUND");
      return;
    }
    for (j = 0; j < subscription_plans_List.length; j++) {
      console.log(
        "RENEWAL_REMINDER " +
          subscription_plans_List[j].type +
          " " +
          subscription_plans_List[j].expirDate
      );
    }
    console.log("RENEWAL_AMOUNT " + totalAmount);
  };

  data = fs.readFileSync(process.argv[2]).toString();
  const addTop = (device, num) => {
    if (subPlan.date == "NULL") {
      console.log("ADD_top_Up_FAILED INVALID_DATE");
      return;
    }

    if (subscription_plans_List.length === 0) {
      console.log("ADD_top_Up_FAILED SUBSCRIPTIONS_NOT_FOUND");
      return;
    }

    let checkSubscri = Top_Up_List.find((item) => item == device + "_" + num);
    if (checkSubscri) {
      console.log("ADD_top_Up_FAILED DUPLICATE_top_Up");
      return;
    }
    let topInfo = top_Up[device];
    let topPrice = topInfo.amount * num;
    totalAmount = totalAmount + topPrice;
    Top_Up_List.push(device + "_" + num);
  };

  const subScrip = (type, plan) => {
    let planDetails = Plans[type];
    let month = planDetails[plan.trim()].time;
    if (subPlan.date == "NULL") {
      console.log("ADD_SUBSCRIPTION_FAILED INVALID_DATE");
      return;
    }

    let expirDate = moment(subPlan.date, "DD-MM-YYYY")
      .add(month, "M")
      .format("DD-MM-YYYY");
    let obj = {
      type,
      plan,
      startDate: subPlan.date,
      expirDate: moment(expirDate, "DD-MM-YYYY")
        .subtract(10, "days")
        .format("DD-MM-YYYY"),
    };

    let checkSubscri = subscription_plans_List.find(
      (item) => item.type.trim() == type.trim()
    );
    if (checkSubscri) {
      console.log("ADD_SUBSCRIPTION_FAILED DUPLICATE_CATEGORY");
      return;
    }

    if (!checkSubscri) {
      subscription_plans_List.push(obj);
      totalAmount = totalAmount + planDetails[plan.trim()].amount;
    }
  };
  const addDate = (dateString) => {
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    if (dateString.match(regex) === null) {
      console.log("INVALID_DATE");
      subPlan.date = "NULL";
      return "NULL";
    }
    const [DD, MM, YYYY] = dateString.split("-");
    const isoFormattedStr = `${YYYY}-${MM}-${DD}`;
    const date = new Date(isoFormattedStr);
    const timestamp = date.getTime();
    if (typeof timestamp !== "number" || Number.isNaN(timestamp)) {
      console.log("INVALID_DATE");
      subPlan.date = "NULL";
      return "NULL";
    }
    subPlan.date = dateString;
    return date.toISOString().startsWith(isoFormattedStr);
  };
  main(data);

  module.exports = { main };
});
