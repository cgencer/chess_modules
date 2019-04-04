jQuery(function($){
	var fens = [
		'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
		'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
		'b7/r1P1PP2/6PP/1K2p1pk/8/1p2r3/5q1n/B7 w - - 0 1',
		'8/P5k1/2n2r2/8/b2R4/1p6/3nK2p/8 w - - 0 1',
		'4k3/8/8/8/8/8/4P3/4K3 w - - 5 39'
	];
	var lineData = [], movesData = [];
	var socket = io.connect('https://lab.piyononline.com:4001/fish', {
		query: 'fen=' + window.btoa(
			fens[ Math.floor(Math.random()*fens.length)]
			)
	});

	socket.on('connect', function () {
		socket.emit('pushStats', 'cg', function(data){
			if(data){
				var statData = JSON.parse(data);
				statData = statData.data;
				var response = "<dl>";
				$.each(statData, function(key, item){
					response += "<dt>" + item.w.mg + ' | ' + item.b.mg + ' | ' + item.t.mg + "</dt>\n";
				});
				response += "</dl>";
				$('#container').html(response);
			}
		});
	});

	socket.on('response', function (data) {
		if(data){
			var px = JSON.parse(data);
			lineData.push(px);
			movesData.push(px.moves);
			$('#container2').append('moves: '+px.moves+'<br />');
			$('#container2').append('-----------------<br />');
		}

	});
})(jQuery);
