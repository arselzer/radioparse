var pcap = require("pcap")
var fs = require("fs")
var radioparse = require("../index")

//var session = pcap.createSession("mon0")

//session.on("packet", function(raw) {
var files = fs.readdirSync("./bad_packets");

files.forEach(function(file) {
  var packet = radioparse.parse(
      fs.readFileSync("./bad_packets/" + file))

  /*if (packet.frame) {
    if (packet.frame.type === 0 && packet.frame.subtype === 4) 
      console.log(packet)
  }*/

  console.log(packet)
})
//})
