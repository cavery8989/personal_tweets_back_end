module.exports = {
  makeCharacterisitcObj: makeCharacteristicObj
};

function makeCharacteristicObj (name, percentage) {
  var obj = {};
  obj.name = name;
  obj.percentage = percentage;

  return obj
}