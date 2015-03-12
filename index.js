var pcap = require("pcap")
var radiotap = require("./radiotap.js")

var session = pcap.createSession("mon0")

session.on("packet", function(raw) {
  var packet = radiotap(raw)
  console.log(packet)
})
