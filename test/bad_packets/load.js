var pcap = require("pcap");
var fs = require("fs");
var radioparse = require("radioparse");

//Directory of packet 'slices'
var dirname = "bad_packets/";

fs.readdir(dirname, function(err, filenames) {
	if (err) {
		console.log(err);
		return;
	}

	filenames.forEach(function(filename) {

		var path = dirname + filename;

		var packetSlice = fs.readFileSync(path);

		var radioPacket;
		try {
			radioPacket = radioparse.parse(packetSlice);
		}
		catch (err) {
			console.log("Bad", filename);
			console.log(err);
			return;
		}

		console.log("Good", "type", radioPacket.frame.type, "subtype", radioPacket.frame.subtype, filename);
	});
	
	console.log('done, processed:', filenames.length);	
});

