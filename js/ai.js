(function ($, Drupal, _, Mustache) {
	Drupal.behaviors.chessAI = {

		buildContent: function (data) {
			var statData = JSON.parse(data);
			statData = statData.data;

			$.get('../templates/gameStats.mst', function(template) {
				return (Mustache.render(template, {data: statData}));
			});
		},

		decorateMoves: function (mObj) {
			if(!_.isEmpty(mObj)){
				if($('tr#resultsRowNo_'+ mObj.id).length === 0)
					$('#chessboardAIResults table').append('<tr id="resultsRowNo_'+ mObj.id+'"></tr>');

				$('tr#resultsRowNo_'+mObj.id).html(
					'<td class="resultsLineNo resultsLineNo_'+mObj.id+'">'+mObj.id+'</td>'+
					'<td class="resultMoves resultMoves_'+mObj.id+'"></td>');

				for (var i = 0; i < mObj.moves.length; i++) {
					$('#chessboardAIResults .resultMoves_'+mObj.id).append('<a class="zapToMove" data-fen="'+'Base64edFENString'+'">'+mObj.moves[i]+'</a> ');
				}
			}
		},

		attach: function (context, settings) {
			console.log('starting ai...');
			// var token = PubSub.subscribe('poBox.getBoardData', this.subscriptionAI);

			var lineData = [], movesData = [];
			var socket;
			var lastInfoNo = 0;
			var dizInfoNo = 0;
			var savedSet = {};

			$('#chessboardAIResults').html('<table></table>');

			var stockfish = new Worker('modules/kingfish/js/vendor/stockfish.js');
			var diz = this;
			stockfish.onmessage = function onmessage(event) {

				var lines = [];
				var line = String(event.data);
				var lzid = 0;
				var lhatched;
				var lkt;

				if(line === 'uciok'){
					console.log('fen: '+$('textarea[id$="Fen"]').val());
					stockfish.postMessage('setoption name MultiPV value 1');
					stockfish.postMessage('position fen '+$('textarea[id$="Fen"]').val());
					stockfish.postMessage('eval');
					stockfish.postMessage('go depth 20');
				}
console.log(line);
				if (line.indexOf("info depth") > -1) {

					var tmp = line.substr(0, line.indexOf("seldepth")-1).split(' ');
					var zid = Number(tmp[tmp.length-1])

					// retrieve the last past after 'pv'
					katch = line.match(/\s+pv\s+(.*)$/gim);
					var kt = katch[0].trim().substr(3);
console.log(kt);

					if(zid > lzid) {
						savedSet = {
							'id': 		zid,
							'moves': 	kt.split(' ')
						};
						diz.decorateMoves(savedSet);
					}
				}
			};
			stockfish.postMessage('uci');
/*
			$('#getAIResults').on('click', function(){
				socket = io.connect('https://lab.piyononline.com:4001/fish', {
				// rejectUnauthorized: false,
				// ca: fs.readFileSync('server-cert.pem')
					query: {
						fen: 	window.btoa( $('textarea[id$="Fen"]').val() )
					}
				});
			});
			
			socket.on('connect', function () {
				socket.emit('pushStats', 'cg', function(data){
					if(data)
						$('#chessboardAIResults').html( this.buildContent(data) );
				});
			});

			socket.on('response', function (data) {
				if(data) {
					var px = JSON.parse(data);
					lineData.push(px);
					movesData.push(px.moves);
					$('#chessboardAIResults').append('moves: ' + px.moves + '<br />');
					$('#chessboardAIResults').append('-----------------<br />');
				}
			});
*/
		}
	}
	Drupal.behaviors.chessAI.attach();
}
)(jQuery, Drupal, _, Mustache);
