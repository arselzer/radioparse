var pcap = require("pcap")
var parse = require("./parse.js")

var session = pcap.createSession("mon0")

session.on("packet", function(raw) {
  var packet = parse(raw.buf)
  //console.log(console.log(packet.ieee80211.type, packet.ieee80211.subtype))
  console.log(packet)
})
