(function ($, Drupal, pgnView, pgnEdit) {

	$message = 'within GAME.JS!';
	console.log($message);

//	console.log('FEN: '+Base64.decode(pstFen));
    var pgn = '[Event "Paris"]\
    [Site "?"]\
    [Date "1821.??.??"]\
    [Round "3"]\
    [White "Lewis, William"]\
    [Black "Deschapelles, Alexandre"]\
    [Result "1-0"]\
    [Annotator "JvR"]\
    [EventDate "1821.??.??"]\
\
    {The development of chess was stimulated in the coffee houses. Philidor and\
        Stamma played in Old Slaughter (London 1747). Only the result is known (+8, =1,\
            -1). At the beginning of the nineteenth century it became possible to travel\
        from London to Paris within a week. Lewis travelled as a tourist to Paris. At\
        the Cafe de la Regence he played three games in four hours against\
        Deschappeles. Lewis got a pawn and the move in each game. Two games ended in a\
        draw. The decisive combination in game three follows.} \
    17. f4 $1 { White opens the position for an attack on the central files.} 17... d5 18. Bb3\
    {Black threatened 18...Qc5+.} 18... dxe4 19. Nxe4 $1 {Central pawn vanish.}\
    19... fxe4 20. fxe5+ Ke8 21. Bf7+ Qxf7 22. Rxf7 Kxf7 23. Qb3+ $2 (23. Qf4+ {\
        continues the attack.}) 23... Ke7 $2 (23... Re6 {stops the attack.}) 24. Qg8\
    Bf8 25. Qg5+ Kf7 26. Rf1+ Ke8 27. Qg8 {\
        The players were ready for dinner in time.}';

	var board = pgnEdit('theBoardID', {
		width: 			'500px',
		coordsInner: 	false,
//		pgn: 			pgn, //pstPgn !== '' ? Base64.decode(pstPgn) : '', 
		position: 		'r1b2k2/pp2q1b1/2pp3r/4pp2/2B1P3/2N3Q1/PPP2PPP/3R1RK1 w - - 0 17', //pstFen !== '' ? Base64.decode(pstFen) : 'start', 
		layout: 		'top',
		locale: 		'en', 
		pieceStyle: 	'merida' 
	});

})(jQuery, Drupal, pgnView, pgnEdit);