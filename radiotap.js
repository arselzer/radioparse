var tools = require("./tools")
var frame = require("./80211_frame")

var flags_to_array = tools.flags_to_array

var rt_types = {
	"TSFT": 0,
	"FLAGS": 1,
	"RATE": 2,
	"CHANNEL": 3,
	"FHSS": 4,
	"DBM_ANTSIGNAL": 5,
	"DBM_ANTNOISE": 6,
	"LOCK_QUALITY": 7,
	"TX_ATTENUATION": 8,
	"DB_TX_ATTENUATION": 9,
	"DBM_TX_POWER": 10,
	"ANTENNA": 11,
	"DB_ANTSIGNAL": 12,
	"DB_ANTNOISE": 13,
	"RX_FLAGS": 14,
	"TX_FLAGS": 15,
	"RTS_RETRIES": 16,
	"DATA_RETRIES": 17,
	"EXT": 31
}

function slice_packet(raw) {
  var len = raw.header.readUInt32LE(12)
  return raw.buf.slice(0, len)
}

function parse(buf) {
  var header = {}
  /* Radiotap Header */

  var pos = 0
  header.revision = buf.readUInt8(pos)
  pos += 1
  
  header.pad = buf.readUInt8(pos)
  pos += 1
  
  header.length = buf.readUInt16BE(pos)
  pos += 2
  
  var flags1 = buf.readUInt32BE(pos)
  var flags2 = buf.readUInt32BE(pos + 4)
  var present_flags = flags_to_array(flags1, 32).concat(flags_to_array(flags2, 32))
  header.present_flags = present_flags
  pos += 8 + 4 // space

  // mac timestamp
  header.mac_timestamp = buf.slice(pos, pos + 8)
  pos += 8
  
  header.flags = flags_to_array(buf.readUInt8(pos), 8)
  pos += 1
  
  header.data_rate = buf.readUInt8(pos)
  pos += 1
  
  header.frequency = buf.readUInt16BE(pos)
  pos += 2

  header.channel_type = flags_to_array(buf.readUInt16BE(pos), 16)
  pos += 2

  header.ssi_signal = buf.readInt8(pos)
  pos += 1 + 1

  header.rx_flags = flags_to_array(buf.readUInt16BE(pos), 16)
  pos += 2

  // SSI signal again
  pos += 1

  header.antenna = buf.readUInt8(pos)
  pos += 1

  /* 802.11 header */

  header.frame = frame.parse(buf.slice(pos, buf.length))

  return header
}

module.exports = {
  parse: parse,
  slice_packet: slice_packet
}
