var tools = require("./tools")
var frame = require("./frame")

var flags_to_array = tools.flags_to_array

function parse(raw) {
  var header = {}
  /* Radiotap Header */

  var pos = 0
  header.revision = raw.readUInt8(pos)
  pos += 1
  
  header.pad = raw.readUInt8(pos)
  pos += 1
  
  header.length = raw.readUInt16BE(pos)
  pos += 2
  
  var flags1 = raw.readUInt32BE(pos)
  var flags2 = raw.readUInt32BE(pos + 4)
  var present_flags = flags_to_array(flags1, 32).concat(flags_to_array(flags2, 32))
  header.present_flags = present_flags
  pos += 8 + 4 // space

  // mac timestamp
  header.mac_timestamp = raw.slice(pos, pos + 8)
  pos += 8
  
  header.flags = flags_to_array(raw.readUInt8(pos), 8)
  pos += 1
  
  header.data_rate = raw.readUInt8(pos)
  pos += 1
  
  header.frequency = raw.readUInt16BE(pos)
  pos += 2

  header.channel_type = flags_to_array(raw.readUInt16BE(pos), 16)
  pos += 2

  header.ssi_signal = raw.readInt8(pos)
  pos += 1 + 1 // space

  header.rx_flags = flags_to_array(raw.readUInt16BE(pos), 16)
  pos += 2

  // SSI signal again
  pos += 1

  header.antenna = raw.readUInt8(pos)
  pos += 1

  /* 802.11 header */

  header.frame = frame.parse(raw.slice(pos, raw.length))

  return header
}

module.exports = parse
