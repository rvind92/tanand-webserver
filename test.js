var jsonData = {
   "version": "1.1",
   "devices": [
      {
         "mac": "000D6F0000758858",
         "model": "SG3010-T2"
      },
      {
         "mac": "00124B0007306285",
         "model": "SG110-A"
      },
      {
         "mac": "00124B00094E89B3",
         "model": "SG110-TSA"
      },
      {
         "mac": "000D6F0003E69466",
         "model": "SG3030"
      }
   ]
}

console.log(jsonData);

jsonDevices = jsonData.devices;

console.log(jsonDevices);

jsonDevicesFirst = jsonDevices[0];

console.log(jsonDevicesFirst);


time = { "time" : "14013243" }
jsonDevicesFirst.time = time;

console.log(jsonDevicesFirst);