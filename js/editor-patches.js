(function ($, Drupal, PouchDB) {
	var edita = {
		fastMode: false,
		theBoardID: "theBoardID",
		remoteDB: new PouchDB('http://piyon:akademi@akademi.piyononline.com:5984/games'),
		localDB: new PouchDB('games'),
		comments: [],
		modals: {
			request: 'i', //'s'
			state: 0,
			comment: false,
			info: false,
			load: false,
			save: false
		},

    	replaceComments: function(content) {
			return content	.replace(/\{.*?\}/gm, '')
							.replace(/\(.*?\)/gm, '');
	    },
		createId: function() {
			return 'xxxxxxxx'.replace(/x/g, function(c) {
				var r = Math.random() * 16 | 0;
				return r.toString(16);
			});
		},
		isABootstrapModalOpen: function () {
		    return $('.modal.in').length > 0;
		},
		isAnyMoveClickedYet: function () {
			return $('.move a.yellow').length > 0;
		},
		addPasteEvents: function () {
			if(!this.fastMode){
				var form = $('<form>');
				form.attr('action', 'index.php?id=' + this.createId());
				form.attr('method', 'POST');
				$('#loadPGN').on('change keyup paste', function(e){
					var input = $('<input type="hidden" name="pgnGame" value="'+Base64.encode($(this).val().trim())+'" />');
					input.appendTo(form);
					form.appendTo(document.body);
					if(input.val()!=='')form.submit();
					form.remove();
				});
				$('#loadFEN').on('change keyup paste', function(e){
					var input = $('<input type="hidden" name="fenGame" value="'+Base64.encode($(this).val().trim())+'" />');
					input.appendTo(form);
					form.appendTo(document.body);
					if(input.val()!=='')form.submit();
					form.remove();
				});
			}
		},
		displayName: function (item) {
			var ms = ['Ock', 'Şbt', 'Mrt', 'Nis', 'May', 'Haz', 'Tem', 'Ağs', 'Eyl', 'Ekm', 'Ksm', 'Arl'];
			var d = new Date(item.date);
			var i = !_.isUndefined(item.gameData) ? item.gameData : {title:''};
			return d.getDay() + ms[d.getMonth()] + '@' + d.getHours() + ':' + d.getMinutes() + i.title;
		},
		retrieveGames: function(db, status){
			var diz = this;
			diz.localDB.find({
				selector: {state: status},
				fields: ['_id', 'author', 'info', 'date', 'pgn', 'fen'],
			}).then(function (res) {
				$('.gameList-'+status).empty();
				if(res.docs.length>1){
					_.each(res.docs, function(i,v){
						$('.gameList-'+status).append('<a href="#" class="list-group-item list-group-item-action" id="'+i._id+'" alt="' + Base64.encode(JSON.stringify(i)) + '">'+diz.displayName(i)+'</a>');
					});
				}
				$('.gameList-'+status+' a.list-group-item').on('mouseenter', function(e){
					var item = JSON.parse( Base64.decode( $(this).attr('alt') ) );
					console.dir(item);
					$('.gameCard .card-img-top').attr('src', !_.isUndefined(item.fen) ? 'http://www.fen-to-image.com/image/24/' + Base64.decode(item.fen) : '');
					$('.gameCard .card-title').text( !_.isUndefined(item.info) ? item.info : '');
					$('.gameCard .card-text').html( !_.isUndefined(item.short) ? '<small>' + Base64.decode(item.short) + '</small>' : '');	
					$('#loadButton').attr('alt', item.pgn);
					$('#loadButton').on('click', function(){
						$('#loadPGN').val(Base64.decode($(this).attr('alt')));
						var form = $('<form>');
						form.attr('action', 'index.php?id=' + diz.createId());
						form.attr('method', 'POST');
						var input = $('<input type="hidden" name="pgnGame" value="'+$(this).attr('alt')+'" />');
						input.appendTo(form);
						form.appendTo(document.body);
						form.submit();
						form.remove();
						diz.modals.state = 0;
					});
				});
			}).catch(function (err) {
				console.dir(err);
			});
		},
		saveItems: function(){
			var diz = this;
			var game = $('textarea.pgn').text();
			var fen = $('#'+diz.theBoardID+'Fen').val();
			$('#boardButtonfirst').click();

			var paket = {
				pgn: Base64.encode($('textarea.pgn').text()),
				fen: Base64.encode(fen),
				short: Base64.encode(this.replaceComments(game).substr(0, 64)),
				author: 1,
				state: 'preview',
				// preview -> (build gifanim) -> review -> live / deleted / onhold
				// fens: (branchFens.length>2) ? branchFens : [],
				gameData: {
					title: $('#db_Name').val(),
					info: $('#db_Info').val(),
					elo: $('#eloRating').val(),
					category: $('#db_Categories').val().split('|'),
					tags: $('#db_Tags').val().split('|'),
				},
				players: {
					white: $('#db_White').val(),
					black: $('#db_Black').val(),
				},
				time: {
					min: $('#db_MinTime').val(),
					max: $('#db_MaxTime').val()
				},
				date: new Date().toISOString()
			};

			this.remoteDB.post(paket).then(function (doc) {
				if(doc.ok) {
					console.log('created entry.');
					$('#saveModal').modal('hide');
					diz.modals.state = 1;

					_.each(['preview', 'review', 'live', 'deleted', 'onhold'], function(i, v){
						diz.retrieveGames(this.localDB, i);
					});
				}
			}).catch(function (err) {
				console.dir(err);
			});
		},
		moveListPatches: function(){
			$('div#'+this.theBoardID+'Moves>.comment').wrap("<i class='fa fa-comment' alt=''></i>");
			$('i.fa-comment-alt').each(function(i,v){
		    	$(this).attr('alt', $(this).text());
		    	$(this).text('');
			});
			$('div#'+this.theBoardID+'Moves .comment').each(function(){
				if($(this).text() !== '')
					$(this).html("<i class='cgPatches fa fa-comment' title='"+$(this).text()+"'>&nbsp;</i>");
			});
			$('.moveNumber').each(function(i,v){
				if(!$(this).parent('.move').hasClass('var'))
					$(this).parent().before('<br />');
				if($(this).text().trim().substr(-3,3) === '...')
					if(!$(this).parent('.move').hasClass('var'))
						$(this).prepend('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
			});
		},
		patchUI: function(inComing){

			var diz = this;
			diz.theBoardID = inComing ? inComing : diz.theBoardID;

			$('#edit'+diz.theBoardID+'Button i.button').on('click', function(){
				$('#'+diz.theBoardID+'Moves br').remove();
				diz.moveListPatches();
			});

			$('.cgPatches').remove();

			$('body').append( $('#'+diz.theBoardID+'Error').detach() );

			$('#'+diz.theBoardID+'Buttonpgn').css('display', 'none');
			$('#edit'+diz.theBoardID+'Button').prepend(
				'<i id="'+diz.theBoardID+'Buttonload" 	data-toggle="modal" data-target="#loadModal" 	 class="cgPatches default btn btn-primary button fa fa-refresh" 		title="Load game"></i>');
			$('#edit'+diz.theBoardID+'Button').append(
				'<i 					 				data-toggle="modal" data-target="#helpModal" 	 class="cgPatches default btn btn-primary button fa fa-comment" 		title="Help"></i>' +
				'<i id="'+diz.theBoardID+'Buttoninfo" 	data-toggle="modal" data-target="#infoModal" 	 class="cgPatches default btn btn-primary button fa fa-info-circle" 	title="Game Data"></i>' +
				'<i id="'+diz.theBoardID+'Buttonsave" 	data-toggle="modal" data-target="#saveModal" 	 class="cgPatches default btn btn-primary button fa fa-upload" 			title="Save game"></i>');

			$('#edit'+diz.theBoardID+'Button, #edit'+diz.theBoardID+'Button a, #edit'+diz.theBoardID+'Button a').css('margin', '5px');
			$('#'+diz.theBoardID+'Button, #edit'+diz.theBoardID+'Button').css('text-align', 'center')
			$('#'+diz.theBoardID+'Moves').css('width', '250px');
			$('#'+diz.theBoardID+'Moves').css('overflow', 'auto');
			$('#'+diz.theBoardID+'Moves').css('min-height', '500px');
			$('#'+diz.theBoardID+'Moves').css('height', '500px');
			$('#'+diz.theBoardID+'Moves').css('border', '1px solid #ccc');

			$('#'+diz.theBoardID+'Button i.button').each(function(i,v){
				$(this).wrap('<a href="#" class="btn btn-primary btn-sm" role="button">');
				$(this).parent('a').attr('id', $(this).attr('id'));
				$(this).attr('id', '');
				$(this).parent('a').attr('title', $(this).attr('title'));
				$(this).attr('title', '');
			});
			$('#edit'+diz.theBoardID+'Button i.button').each(function(i,v){
				if($(this).css('display') !== 'none'){
					$(this).wrap('<a href="#" class="btn btn-primary btn-sm" role="button">');
					$(this).removeClass('button');
					$(this).removeClass('btn');
					$(this).removeClass('btn-primary');
				}
			});

			$('#pgn'+diz.theBoardID+'Button').wrap('<div style="display:none;"></div>');
			$('#saveModal').modal('hide');
			$('textarea.comment').hide();

			$('#tdbH').html( $('#'+diz.theBoardID+'Headers').detach() );
			$('#tdLs').html( $('#'+diz.theBoardID).detach() );
			$('#tdRs').html( $('#'+diz.theBoardID+'Moves').detach() );
			$('#'+diz.theBoardID+'Fen').css('display', 'none');

			$('#'+diz.theBoardID+'Buttoninfo').on('click', function(){
				diz.modals.request = 'i';
			});
			$('#'+diz.theBoardID+'Buttonsave').on('click', function(){
				diz.modals.request = 's';
			});
			$('#'+diz.theBoardID+'Buttonload').on('click', function(){
				diz.modals.request = 'l';
			});
			if($('#chessboardButtons')){
				$('#chessboardButtons').html( $('#theBoardIDButton').detach() )			
				$('#chessboardButtons').prepend( $('#edittheBoardIDButton').detach() );
			}

			diz.moveListPatches();

			// $('.commentRadio').css('display', 'none');
			// $('textarea.comment').hide();

			var commArea = $('#comment'+diz.theBoardID+'Button').detach();
			
			$('.radio-group label').on('click', function(){
				$('textarea.comment').show();
				$(this).removeClass('not-active').siblings().addClass('active');
			});


			$(document).on('keyup', function(e) {
				var key = e.key; // String.fromCharCode(e.which);
				var keyC = e.keyCode;

				if(key == 'i' && !diz.isABootstrapModalOpen()){
 					$('#infoModal').modal('show');
				}else if(key == 'p' && !diz.isABootstrapModalOpen()){
					diz.fastMode = true;
					$('#loadPGN, #loadFEN').off();
					$('#loadModal').removeClass('fade');
					$('#loadModal').modal('show');
					$('#loadPGN').focus();
					$('#loadPGN').trigger('focus');
					$('#loadFEN').val('');
					$('#loadPGN').val('');
					$('#loadModal').addClass('fade');
					diz.fastMode = false;
					diz.addPasteEvents();

				}else if(key == 'f' && !diz.isABootstrapModalOpen()){
					diz.fastMode = true;
					$('#loadPGN, #loadFEN').off();
					$('#loadModal').removeClass('fade');
					$('#loadModal').modal('show');
					$('#loadFEN').focus();
					$('#loadFEN').trigger('focus');
					$('#loadFEN').val('');
					$('#loadPGN').val('');
					$('#loadModal').addClass('fade');
					diz.fastMode = false;
					diz.addPasteEvents();

				}
			});
			$(document).on('keydown keypress', function(e) {
				var key = e.key; // String.fromCharCode(e.which);
				var keyC = e.keyCode;
				if(keyC === 32 && e.target == document.body) {
					e.preventDefault();
					if(diz.isAnyMoveClickedYet() && !diz.isABootstrapModalOpen()){
						$('#commentModal').modal('show');
					}
				}
			});

			$( document ).ready(function() {
				$('#komma').empty();
				$('#komma').html( commArea );
				$("input[type='number']").InputSpinner();

				$('#nagMenu'+diz.theBoardID+'Button a i').each(function(){
					$(this).text(edita.comments[Number($(this).attr('data-value'))]);
				});

				$('.move').click('once', function(){
					$('#'+diz.theBoardID+'ButtonpromoteVar, #'+diz.theBoardID+'ButtondeleteMoves, #'+diz.theBoardID+'Buttonnags').prop('disabled', true);
				});

				$('#field_Category').tagEditor();
				$('#field_Tags').tagEditor({ initialTags: ['eğitim', 'problem'] });

				$('#saveModal').on('shown.bs.modal', function () {

					$('#'+diz.theBoardID+'Buttonpgn').click();
					$('#'+diz.theBoardID+'Buttonpgn').click();
					$('#'+diz.theBoardID+'Buttonlast').click();
					$('form.gameSave textarea').val( $('#pgn'+diz.theBoardID+'Button').val() );

					if(diz.modals.state !== 0) {
						diz.modals.save = true;
						$('#'+diz.theBoardID+'Buttonpgn').click();
						$('#'+diz.theBoardID+'Buttonpgn').click();
						$('#'+diz.theBoardID+'Buttonlast').click();
						$('form.gameSave textarea').val( $('#pgn'+diz.theBoardID+'Button').val() );
						diz.saveItems();
					}else{
						$('#saveModal').modal('hide');
						$('#infoModal').modal('show');
					};
				});
				$('#saveModal').on('hidden.bs.modal', function () {
					diz.modals.save = false;
				});
				$('#commentModal').on('shown.bs.modal', function () {
					$('textarea.comment').hide();
					diz.modals.comment = true;
					$('#commentAreaPop').on('change keyup keydown', function () {
						$('textarea.comment').val( $(this).val() );
					});
				});
				$('#commentModal').on('hidden.bs.modal', function () {
					diz.modals.comment = false;
				});

				$('#infoModal').on('shown.bs.modal', function () {
					diz.modals.info = true;
					$('form.gameInfo #field_GameName').val( $('#'+diz.theBoardID+'Headers').text() );
					$('form.gameInfo #field_whitePlayer').val( $('#'+diz.theBoardID+'Headers .whiteHeader').text() );
					$('form.gameInfo #field_blackPlayer').val( $('#'+diz.theBoardID+'Headers .blackHeader').text() );
					$('form.gameInfo #field_Info').val( $('#'+diz.theBoardID+'Headers .restHeader').text() );
					$('#saveHeader').on('click', function() {
						if(	$('form.gameInfo #field_GameName').val() === '' &&
							$('form.gameInfo #field_timeMin').val() === '' &&
							$('form.gameInfo #field_timeMax').val() === ''
							) {
							diz.modals.state = 0;
						}else{
							$('#db_Name').val( 			$('form.gameInfo #field_GameName').val() 		);
							$('#db_White').val( 		$('form.gameInfo #field_whitePlayer').val() 	);
							$('#db_Black').val( 		$('form.gameInfo #field_blackPlayer').val() 	);
							$('#db_Info').val( 			$('form.gameInfo #field_Info').val() 			);
							$('#db_Elo').val( 			$('form.gameInfo #field_elo').val() 			);
							$('#db_MinTime').val( 		$('form.gameInfo #field_timeMin').val() 		);
							$('#db_MaxTime').val( 		$('form.gameInfo #field_timeMax').val() 		);
							$('#db_Categories').val( 	$('#field_Category').tagEditor('getTags')[0].tags.join('|') 	);
							$('#db_Tags').val( 			$('#field_Tags').tagEditor('getTags')[0].tags.join('|') 		);
							$('#db_Status').val( 		$('form.gameInfo #field_Status').val() 			);
							$('#db_Author').val( 		$('form.gameInfo #field_Author').val() 			);
							diz.modals.state = 1;
							$('#infoModal').modal('hide');
							if(diz.modals.request === 's') {
								$('#saveModal').modal('show');
								diz.modals.state = 2;
							};
						};
					});
				});
				$('#infoModal').on('hidden.bs.modal', function () {
					diz.modals.info = false;
				});

				$(document).on('shown.bs.modal', '#loadModal', function (e) {
				});

				diz.addPasteEvents();
			});
		},
		init: function(refresh, $){
			var diz = this;

			console.log('booting up...');

			$.getJSON('http://theme.piyononline.com/modules/chess_kingfish/xl8.json', {})
				.done(function( json ) {
					edita.comments = json;
				})
				.fail(function( jqxhr, textStatus, error ) {
					var err = textStatus + ", " + error;
					console.log( "Request Failed: " + err );
				}
			);

			this.localDB.sync(this.remoteDB, {
				live: true,
				retry: true
			}).on('change', function (change) {
				console.log('data change', change)
			}).on('error', function (err) {
				console.log('sync error', err)
			});
			_.each(['preview', 'review', 'live', 'deleted', 'onhold'], function(i, v){
				diz.retrieveGames(this.localDB, i);
			});
			$(document).ready(function() {
				diz.patchUI('theBoardID');
			});

		}
	};
	var genNew = function (pastedPgn) {
			console.log('arrived');

			$('#'+this.theBoardID).remove();
			$('#'+this.theBoardID+'Error').remove();
			/*
			$('#'+this.theBoardID+'Moves').remove();
			$('#'+this.theBoardID+'Button').remove();
			$('#'+this.theBoardID+'Fen').remove();
			*/
			$('#theTable').remove();
			delete window.pgnTestRegistry[this.theBoardID];
			pgnBase().reset();

			this.theBoardID = "board_" + this.createId() + '_';
			console.log('deleted... and created '+this.theBoardID);
			$('body').prepend('<table id="theTable"><tr><td id="tdbH" colspan="2"></td></tr><tr><td id="tdLs"></td><td id="tdRs"></td></tr><tr><td id="tdbH" colspan="2"></td></tr></table><div id="'+this.theBoardID+'" class="alpha zeit"></div>');

			var base = pgnBase(this.theBoardID, {
				showFen: true, 
				mode: 'edit', 
				movable: { 
					free: false, 
					events: {
						after: function(orig, dest, meta) {
							base.onSnapEnd(orig, dest, meta);
						}
					}
				}, 
				viewOnly: false,
				width: '500px',
				coordsInner: false,
				pgn: pastedPgn,
				fen: '1n1r3r/1k2q1p1/1bp1p2p/5p2/2Pp1B2/5QN1/5PPP/RR4K1 w - - 0 29',
				layout: 'top',
				locale: 'en',
				pieceStyle: 'merida'
			});

			console.log('generated');
			window.pgnBase().chess.load_pgn(pastedPgn);
			base.generateHTML();
			var board = base.generateBoard();
			base.generateMoves(board);

			init(true);
			$('#loadModal').modal('hide');
	};

	edita.init(false, $);
})(jQuery, Drupal, PouchDB);

// TODOs:
// 	modal window for Save										DONE 	functions OK
//	window for name, timings, scores, elo etc 					DONE 	functions OK
//	window for comment, comment-type							DONE 	needs functions
//	modal window for paste pgn / load game from server			DONE 	functions OK

//	new commands for:
//		- video player sync
//		- questions
//		- video comments in bubble
//	think of: sync'ing with drupal for questions
//	draw arrow, colorize tile editor functions
//	arrow / colorize paste into pgn
