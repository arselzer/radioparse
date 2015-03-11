var pcap = require("pcap")
var radiotap = require("./radiotap.js")

var session = pcap.createSession("mon0")

session.on("packet", function(raw) {
  var packet = radiotap(raw.buf)
  //console.log(console.log(packet.ieee80211.type, packet.ieee80211.subtype))
  console.log(packet)
})
