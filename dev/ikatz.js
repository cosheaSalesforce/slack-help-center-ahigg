const salesforceService = require('../services/salesforce.service');

async function toTest() {
    // var myCases = await salesforceService.getBusinessCases('coshea@salesforce.com', 20);
    // var myCases = await salesforceService.serachBusinessCase('hilabyosef@gmail.com', 'Test');
    // coshea@salesforce.com.invalid
    // var result = await salesforceService.createBusinessCase('test creating bc through slack', 'a0109000010yOBfAAM', 'Education', 'B2B', 'hbenyosef@salesforce.com');
    // var result = await salesforceService.getBusinessCaseById('a025r000001yw9ZAAQ');
    var result = await salesforceService.doLogin();
    // console.log(result.keyPrefix);
    console.log(result);
    // var result = await salesforceService.getDoamin();
    // console.log(result);
}

toTest();