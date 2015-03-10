// buffer to array of (0,1) flags
function flagsArray(n, size) {
  var flags = []
  for (var i = 0; i < size; i++) {
    if ((n & (1 << i)) > 0)
      flags.push(1)
    else
      flags.push(0)
  }
  return flags
}

function readMac(buffer, pos) {
  var bytes = []
  for (var i = 0; i < 6; i++) {
    bytes.push(buffer.readUInt8(pos + i * 8))
  }
  return bytes
}

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
  var present_flags = flagsArray(flags1, 32).concat(flagsArray(flags2, 32))
  header.present_flags = present_flags
  pos += 8 + 4 // space

  // mac timestamp
  header.mac_timestamp = raw.slice(pos, pos + 8)
  pos += 8
  
  header.flags = flagsArray(raw.readUInt8(pos), 8)
  pos += 1
  
  header.data_rate = raw.readUInt8(pos)
  pos += 1
  
  header.frequency = raw.readUInt16BE(pos)
  pos += 2

  header.channel_type = flagsArray(raw.readUInt16BE(pos), 16)
  pos += 2

  header.ssi_signal = raw.readInt8(pos)
  pos += 1 + 1 // space

  header.rx_flags = flagsArray(raw.readUInt16BE(pos), 16)
  pos += 2

  // SSI signal again
  pos += 1

  header.antenna = raw.readUInt8(pos)
  pos += 1

  /* 802.11 header */

  header.ieee80211 = {}

  header.ieee80211.frame_control = raw.readUInt8(pos)
  header.ieee80211.subtype = (header.ieee80211.frame_control >> 4)
  header.ieee80211.type = (header.ieee80211.frame_control >> 2) & 3
  header.ieee80211.version = header.ieee80211.frame_control & 3 // 0b00000011
  pos += 1 + 3 // space

  header.ieee80211.dst_addr = readMac(raw, pos)
  pos += 6
  
  header.ieee80211.src_addr = readMac(raw, pos)
  pos += 6
  
  header.ieee80211.bbs_addr = readMac(raw, pos)
  pos += 6

  header.ieee80211.seq_num = raw.readUInt16BE(pos)
  pos += 2
  
  header.ieee80211.checksum = raw.slice(pos, pos + 4)
  pos += 4

  return header
}

module.exports = parse
