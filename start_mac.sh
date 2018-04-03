#!/bin/bash

osascript -e 'tell app "Terminal"
    do script "sudo mongod
<sudo pswd>" 
end tell'

osascript -e 'tell app "Terminal"
    do script "mongo --host 127.0.0.1:27017" 
end tell'

osascript -e 'tell app "Terminal"
    do script "cd <Path-to-AngularJS>>~/Documents/BSD_WMS/AngularJS
npm run-script start" 
end tell'

osascript -e 'tell app "Terminal"
    do script "cd <Path-to-NodeJS>~/Documents/BSD_WMS/NodeJS_express_WS
nodemon app.js" 
end tell'