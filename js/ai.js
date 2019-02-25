(function ($) {
	var lineData = [], movesData = [];
	var socket;

	$('#getAIResults').on('click', function(){
		socket = io.connect('http://theme.piyononline.com:4001/fish', {
			query: 'fen=' + $('#theBoardIDFen').val()
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
					$('#chessboardAIResults').html(response);
				}
			});
		});

		socket.on('response', function (data) {
			if(data){
				var px = JSON.parse(data);
				lineData.push(px);
				movesData.push(px.moves);
				$('#chessboardAIResults').append('moves: '+px.moves+'<br />');
				$('#chessboardAIResults').append('-----------------<br />');
			}
		});

	})

})(jQuery);
