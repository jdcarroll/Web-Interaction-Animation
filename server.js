var express = require('express'),
    app     = express();

app.use('/',express.static('public'));

app.listen(4000);
console.log('on port 4000');
