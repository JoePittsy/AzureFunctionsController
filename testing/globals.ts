var reporters = require('jasmine-reporters');
var junitReporter = new reporters.JUnitXmlReporter({
    savePath: __dirname,
    consolidateAll: false
});
jasmine.getEnv().addReporter(junitReporter);