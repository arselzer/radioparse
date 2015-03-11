var tools = require("./tools")
var read_mac = tools.read_mac
var flags_to_array = tools.flags_to_array

function merge(obj1, obj2) {
  Object.keys(obj2).forEach(function(key) {
    if (!obj1.hasOwnProperty(key))
      obj1[key] = obj2[key]
  })
}

function parse_tags(buffer) {
  var tagLengths = 0
  var pos = 0

  while (tagLengths !== buffer.length) {
    var tagNum = buffer.readUInt8(pos)
  }
}

function beacon(buffer) {
    var pos = 4 // skip frame control
    var frame = {}

    frame.dst_addr = read_mac(buffer, pos)
    pos += 6
    
    frame.src_addr = read_mac(buffer, pos)
    pos += 6
    
    frame.bbs_addr = read_mac(buffer, pos)
    pos += 6

    frame.seq_num = buffer.readUInt16BE(pos)
    pos += 2
    
    frame.checksum = buffer.slice(pos, pos + 4)
    pos += 4

    // fixed parameters (12 bytes)
    frame.timestamp = buffer.slice(pos, pos + 8)
    pos += 8

    frame.beacon_interval = buffer.readUInt16BE(pos)
    pos += 2

    frame.capabilities = flags_to_array(buffer.readUInt16BE(pos), 16)

    return frame
}

function probe_request(buffer) {
  return {}
}

function probe_response(buffer) {
  return {}
}

module.exports = {
  parse: function(buffer) {
    var frame = {}
    var pos = 0

    frame.frame_control = buffer.readUInt8(pos)
    frame.subtype = (frame.frame_control >> 4)
    frame.type = (frame.frame_control >> 2) & 3
    frame.version = frame.frame_control & 3 // 0b00000011

    // Management Frame
    if (frame.type === 0) {
      if (frame.subtype === 4) // 0100
        merge(frame, probe_request(buffer))
      if (frame.subtype === 5) // 0101
        merge(frame, probe_request(buffer))
      if (frame.subtype === 8) // 1000
        merge(frame, beacon(buffer))
    }
    // Control Frame
    if (frame.type === 1) {
      
    }
    // Data Frame
    if (frame.type === 2) {
      
    }
    
    return frame
  }
}
