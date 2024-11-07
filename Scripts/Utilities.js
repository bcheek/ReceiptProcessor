module.exports = function(){
    this.hashString = function (str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          hash = (hash << 5) - hash + str.charCodeAt(i);
          hash |= 0; // Convert to 32bit integer
        }
        return hash.toString();
    };
    this.parseTimeInput = function (timeString) {
        const timeSplit = timeString.split(':');
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...timeSplit);
    };
    this.calculatePoints = function (reqBody){
        let points=0;

        if(reqBody.retailer){
          const cleanRetailerName = reqBody.retailer.trim().replace(/[^0-9a-z]/gi, '');
          points += cleanRetailerName.length;
        }
      
        if(reqBody.purchaseDate)
        {
          const date=new Date(reqBody.purchaseDate);
          if (date.getDate() % 2 != 0){  //6 points if the day in the purchase date is odd.
            points += 6;
          }
        }
      
        if(reqBody.purchaseTime) { //10 points if the time of purchase is after 2:00pm and before 4:00pm.
          const time = parseTimeInput(reqBody.purchaseTime);
          const hour = time.getHours();
          const min = time.getMinutes();
          const sec = time.getSeconds();
          const ms = time.getMilliseconds();
          if (((hour > 14)||(hour == 14 && (min > 0 || sec > 0 || ms > 0))) && hour < 16) {
            points += 10
          }
        }
  
      if (reqBody.total){
        if (reqBody.total % 1 === 0) {// 75 points if the total is a round dollar amount. 50 for 0 cents 25 for quarter multiple 
          points += 75; 
        }
        else if (reqBody.total % 0.25 == 0) { //25 points if the total is a multiple of 0.25.
          points += 25;
        }
      }
      if (reqBody.items){
        //5 points for every two items on the receipt.
        points += Math.floor(reqBody.items.length / 2) * 5;
        reqBody.items.forEach(item => {
          if(item.shortDescription && item.shortDescription.trim().length % 3 ==0){
            // Add ceil(20% of price) for items with shortDescription length divisible by 3
              points += Math.ceil(item.price * 0.2);
          }
        });
      }
      return points;
    };
  };