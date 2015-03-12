var tools = require("./tools")
var frame = require("./80211_frame")

var flags_to_array = tools.flags_to_array

var types = {
	"IEEE80211_RADIOTAP_TSFT": 0,
	"IEEE80211_RADIOTAP_FLAGS": 1,
	"IEEE80211_RADIOTAP_RATE": 2,
	"IEEE80211_RADIOTAP_CHANNEL": 3,
	"IEEE80211_RADIOTAP_FHSS": 4,
	"IEEE80211_RADIOTAP_DBM_ANTSIGNAL": 5,
	"IEEE80211_RADIOTAP_DBM_ANTNOISE": 6,
	"IEEE80211_RADIOTAP_LOCK_QUALITY": 7,
	"IEEE80211_RADIOTAP_TX_ATTENUATION": 8,
	"IEEE80211_RADIOTAP_DB_TX_ATTENUATION": 9,
	"IEEE80211_RADIOTAP_DBM_TX_POWER": 10,
	"IEEE80211_RADIOTAP_ANTENNA": 11,
	"IEEE80211_RADIOTAP_DB_ANTSIGNAL": 12,
	"IEEE80211_RADIOTAP_DB_ANTNOISE": 13,
	"IEEE80211_RADIOTAP_RX_FLAGS": 14,
	"IEEE80211_RADIOTAP_TX_FLAGS": 15,
	"IEEE80211_RADIOTAP_RTS_RETRIES": 16,
	"IEEE80211_RADIOTAP_DATA_RETRIES": 17,
	"IEEE80211_RADIOTAP_EXT": 31
}


function parse(raw) {
  var len = raw.header.readUInt32LE(12)
  var buf = raw.buf.slice(0, len)

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
  pos += 1 + 1 // space

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

module.exports = parse
