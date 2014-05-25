var temp;
module.exports = function handleConnection(spark) {
  console.log('new connection');
  spark.write({ Welcome: 'Hello!' });
  spark.on('auth', function(msg) {
    console.log(spark.id, 'message!!111', msg);
    spark.send('authed', {authed: msg});
  });
  spark.on('temp', function(msg) {
    console.log('Temp is' + msg);
    temp = msg;
  });
  spark.on('gettemp', function() {
    console.log('got gettemp');
    setInterval(function() {
      spark.send('newtemp', temp);
    }, 1000);
  });
};
