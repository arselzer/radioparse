var pcap = require("pcap")
var radiotap = require("./radiotap.js")

var session = pcap.createSession("mon0")

session.on("packet", function(raw) {
  var packet = radiotap.parse(radiotap.slice_packet(raw))

  if (packet.frame) {
    if (packet.frame.type === 0 && packet.frame.subtype === 4) 
      console.log(packet)
  }

  //console.log(packet)
})
