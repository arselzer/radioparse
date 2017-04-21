var pcap = require("pcap")
var radioparse = require("../index")
var fs = require("fs");
var crypto = require('crypto');

var session = pcap.createSession("mon0")

session.on("packet", function(raw) {
  try {
    var packet = radioparse.parse(radioparse.slice_packet(raw))
  } catch (e) {
    fs.writeFile("bad_packets/" + crypto.createHash('sha256').digest(raw), radioparse.slice_packet(raw));
  }

  /*if (packet.frame) {
    if (packet.frame.type === 0 && packet.frame.subtype === 4) 
      console.log(packet)
  }*/

  console.log(packet)
})
