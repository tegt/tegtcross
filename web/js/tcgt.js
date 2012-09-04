(function( $ ){
    var rowDiv = '<div class="tcgtRow" />';
    var boxDiv = '<div class="tcgt ui-state-default" tabindex="4"> </div>';
    var clues = { aclue: 0, dclue: 1 };

    function reIndex(it, oldMode) { 
	var grid = it.data('tcgtGrid');
	var mode = it.data('tcgtMode');
	var pfix = it.attr('id');
	var miny = grid.length;
	var minx = grid[0].length;
	var maxx = 0;
	var maxy = 0;

	for (var y = 0; y < grid.length; y++) {
	    for (var x = 0; x < grid[y].length; x++) {
		if (oldMode == 'grid')
		    grid[y][x].data('L',grid[y][x].html());
		if (mode == 'play')
		    grid[y][x].html(' ');
		else
		    grid[y][x].html(grid[y][x].data('L'));
		if (mode != grid
		    && grid[y][x].data('L') != ' ') {
		    if (y < miny) miny = y;
		    if (x < minx) minx = x;
		    if (y > maxy) maxy = y;
		    if (x > maxx) maxx = x;
		}
	    }
	}

	if (mode == 'grid') {
	    for (var ad in clues) {
		$('#'+ad+'-'+pfix).hide();
		$('#'+ad+'-in-'+pfix).hide();
		$('#'+ad+'-text-'+pfix).hide();
	    }
	}

	var cluey = new Array(); // current set of down clues
	for (var y = 0; y < grid.length; y++) {
	    var cluex = null; // current across clue
	    for (var x = 0; x < grid[y].length; x++) {
		grid[y][x]
		    .attr({'data-gridy': y, 'data-gridx': x})
		    .data({'gridy': y, 'gridx': x});
		if (mode != 'grid' // unless grid mode hide outer
		    && (x < minx || y < miny || x > maxx || y > maxy)) {
		    grid[y][x]
			.hide()
			.removeData('aclue')
			.removeData('dclue')
			.removeClass('ui-state-default')
			.addClass('ui-widget-header');
		    cluey[x] = cluex = null;
		}
		else { // unhide 
		    if (mode == 'grid') { 
			grid[y][x]
			    .removeClass('ui-widget-header')
			    .addClass('ui-state-default')
			    .show();
		    }
		    else { // clue or play mode
			if (grid[y][x].data('L') == ' ') { // Block
			    grid[y][x] // block box
				.removeClass('ui-state-default')
				.addClass('ui-widget-header');
			    cluey[x] = cluex = null;
			    grid[y][x].data({'aclue': null, 'dclue': null});
			}
			else { // Letter, non-empty
			    if (cluex == null
				&& x+1 < grid[y].length 
				&& grid[y][x+1].data('L') != ' ') {
				cluex = x; // start new across clue
				if (grid[y][x].data('aclue') == null)
				    grid[y][x].data('aclue',''); // new
			    }
			    else  {
				grid[y][x].data('aclue', null);
			    }
			    if (cluey[x] == null
				&& y+1 < grid.length
				&& grid[y+1][x].data('L') != ' ') {
				cluey[x] = y; // start new down clue
				if (grid[y][x].data('dclue') == null)
				    grid[y][x].data('dclue',''); // new
			    }
			    else {
				grid[y][x].data('dclue', null);
			    }
			    grid[y][x]
				.data({cluex: cluex, cluey: cluey[x]})
				.removeClass('ui-widget-header')
				.addClass('ui-state-default')
				.show();
			}
		    }
		}
	    }
	}
    }

    function makeBox(box) {

	box.blur(function(e) {
	    var it  = $(this);
	    var tcgtDiv = it.parent().parent();
	    $('.tcgt', tcgtDiv)
		.removeClass('ui-state-hover ui-state-active');
	});

	box.focus(function(e) {
	    var tcgtDiv, grid, down;
	    var it  = $(this);
	    if (it.data('yc') != null) { // focus is a clue
		tcgtDiv = $('#'+it.parent().attr('id').substr(6));
		down = it.data('cdown');
		tcgtDiv.data('tcgtDown', down);
		grid = tcgtDiv.data('tcgtGrid');
		it = grid[it.data('yc')][it.data('xc')];
	    }
	    else {
		tcgtDiv = it.parent().parent();
		down = tcgtDiv.data('tcgtDown');
		grid = tcgtDiv.data('tcgtGrid');
	    }
	    $('.tcgt', tcgtDiv)
		.removeClass('ui-state-hover ui-state-active');
	    var mode = tcgtDiv.data('tcgtMode');
	    var y = it.data('gridy');
	    var x = it.data('gridx');
	    it.addClass('ui-state-active');

	    switch (mode) {

	    case 'clue':
	    case 'play':
		if (it.hasClass('ui-widget-header')) { // it's a solid block
		    it.blur();
		    return;
		}
		var box;
		var pfix = tcgtDiv.attr('id');
		var cy = it.data('cluey');
		var cx = it.data('cluex');

		var aw = cx != null // across word
		    && cx+1 < grid[y].length
		    && grid[y][cx+1].hasClass('ui-state-default');

		var dw = cy != null  // down word
		    && cy+1 < grid.length
		    && grid[cy+1][x].hasClass('ui-state-default');

		// box may force a orientation
		tcgtDiv.data('tcgtDown', down = down? dw: !aw); 

		var word, clue, text;
		word = $('#dclue-'+pfix).html('').show();
		clue = $('#dclue-in-'+pfix).hide();
		text = $('#dclue-text-'+pfix).hide();
		if (dw) { // down clue
		    clue.data('tcgtBox',grid[cy][x]);
		    if (mode == 'clue')
			clue.val(grid[cy][x].data('dclue')).show();
		    else
			text.html(grid[cy][x].data('dclue')).show();
		    for (; cy < grid.length 
			 && grid[cy][x].hasClass('ui-state-default'); 
			 cy++) {
			word.append(boxDiv);
			makeBox(box = $('.tcgt:last', word));
			box.html(grid[cy][x].html())			    
			    .data( { yc: cy, xc: x, cdown: true } );
			if (down && // highlight selected letter by clue
			    grid[cy][x].hasClass('ui-state-active'))
			    box.addClass('ui-state-active');
		    }
		}

		word = $('#aclue-'+pfix).html('').show();
		clue = $('#aclue-in-'+pfix).hide();
		text = $('#aclue-text-'+pfix).hide();
		if (aw) { // across clue
		    clue.data('tcgtBox',grid[y][cx]);
		    if (mode == 'clue')
			clue.val(grid[y][cx].data('aclue')).show();
		    else
			text.html(grid[y][cx].data('aclue')).show();
		    for (; cx < grid[y].length 
			 && grid[y][cx].hasClass('ui-state-default'); 
			 cx++) {
			word.append(boxDiv);
			makeBox(box = $('.tcgt:last', word));
			box.html(grid[y][cx].html())
			    .data( { yc: y, xc: cx, cdown: false } );
			if (! down && // highlight selected letter by clue
			    grid[y][cx].hasClass('ui-state-active'))
			    box.addClass('ui-state-active');
		    }
		}
		break;

		defult: // not clue mode
		break;
	    }
	    if (down) {
		for (; y > 0 && grid[y-1][x].hasClass('ui-state-default'); y--);
		for (; y < grid.length && grid[y][x].hasClass('ui-state-default'); y++)
		    grid[y][x].addClass('ui-state-hover');
	    }
	    else {
		for (; x > 0 && grid[y][x-1].hasClass('ui-state-default'); x--);
		for (; x < grid.length && grid[y][x].hasClass('ui-state-default'); x++)
		    grid[y][x].addClass('ui-state-hover');
	    }
	});

	box.keydown(function(e) {
	    var it = $(this);
	    var tcgtDiv = it.parent().parent();
	    var wasDown = tcgtDiv.data('tcgtDown');
	    var grid = tcgtDiv.data('tcgtGrid');
	    var mode = tcgtDiv.data('tcgtMode');
	    if (e.keyCode == 0 || e.which == e.keyCode) { // char key
		var letter = e.which & 0xDF; // make upper case
		if (letter > 64 && letter < 91
		    || e.which == 32) { 
		    if (e.which == 32) letter = 32;
		    if (mode != 'clue')
			it.html(String.fromCharCode(letter));
		    e.keyCode = wasDown? 40: 39;
		}
	    }
	    var y = it.data('gridy');
	    var x = it.data('gridx');

	    function setFocus(nowDown, nx, ny) {
		tcgtDiv.data('tcgtDown', nowDown);
		var cy = y + ny;
		var cx = x + nx;
		if (cy < 0 || cy >= grid.length
		    || cx < 0 || cx >= grid[0].length
		    || grid[cy][cx].hasClass('ui-widget-header')) {
		    grid[y][x].focus();
		    return; // can't go into a block
		}
		if (nx < 0)
		    for (;cx > -1 && grid[cy][cx].hasClass('ui-widget-header'); cx--);
		if (nx > 0)
		    for (;cx < grid[0].length && grid[cy][cx].hasClass('ui-widget-header'); cx++);
		if (ny < 0)
		    for (;cy > -1 && grid[cy][cx].hasClass('ui-widget-header'); cy--);
		if (ny > 0)
		    for (;cy < grid.length && grid[cy][cx].hasClass('ui-widget-header'); cy++);
		if (cx > -1 && cx < grid[0].length && cy > -1 && cy < grid.length)
		    grid[cy][cx].focus();
		else
		    grid[y][x].focus();
	    }
	    switch (e.keyCode) {
	    case 37: // left
		setFocus(false, wasDown? 0: -1, 0);
		break;
	    case 38: // up
		setFocus(true, 0, wasDown? -1: 0);
		break;
	    case 39: // right
		setFocus(false, wasDown? 0: 1, 0);
		break;
	    case 40: // down
		setFocus(true, 0, wasDown? 1: 0);
		break;
	    case 8: // backspace
		setFocus(wasDown, wasDown? 0: -1, wasDown? -1: 0);
		break;
	    case 190: // '.' - toggle acoss/down 
		if (mode == 'grid') {
		    setFocus(! wasDown, 0, 0);
		    break;
		}
		tcgtDiv.data('tcgtDown', wasDown = ! wasDown);
		if (wasDown) {
		    if (grid[y][x].data('dclue') != null) {
			grid[y][x].focus();
			break;
		    }
		}
		else {
		    if (grid[y][x].data('aclue') != null) {
			grid[y][x].focus();
			break;
		    }
		}
	    case 13: // return - across down next
		switch (mode) {
		case 'clue':
		case 'play':
		    if (! wasDown // switch across to down as possible
			&& (y < 1 || grid[y-1][x].data('L') == ' ')
			&& (y+1 < grid.length && grid[y+1][x].data('L') != ' ')) {
			tcgtDiv.data('tcgtDown', true);
			grid[y][x].focus();
			break;
		    }
		    x++; // was or can't the move across
		    for (; y < grid.length; y++) {
			for (; x < grid[y].length; x++) {
			    if (grid[y][x].data('aclue') != null) {
				tcgtDiv.data('tcgtDown', false);
				grid[y][x].focus();
				return false; // found a new across
			    }
			    if (grid[y][x].data('dclue') != null) {
				tcgtDiv.data('tcgtDown', true);
				grid[y][x].focus();
				return false; // found a new down
			    }
			}
			x = 0;
		    }			
		    y = 0; // bottom go to top
		    for (; y < grid.length; y++) {
			for (; x < grid[y].length; x++) {
			    if (grid[y][x].data('aclue') != null) {
				tcgtDiv.data('tcgtDown', false);
				grid[y][x].focus();
				return false; // found a new across
			    }
			    if (grid[y][x].data('dclue') != null) {
				tcgtDiv.data('tcgtDown', true);
				grid[y][x].focus();
				return false; // found a new down
			    }
			}
			x = 0;
		    }			
		    break;
		}
		break;

	    case 9: // tab - next word same direction
		switch (mode) {
		case 'clue':
		case 'play':
		    if (wasDown) {
			y++;
			for (; x < grid[y].length; x++) {
			    for (; y < grid.length; y++) {
				if (grid[y][x].data('dclue') != null) {
				    grid[y][x].focus();
				    return false;
				}
			    }
			    y = 0;
			}			
			x = 0;
			for (; x < grid[y].length; x++) {
			    for (; y < grid.length; y++) {
				if (grid[y][x].data('dclue') != null) {
				    grid[y][x].focus();
				    return false;
				}
			    }
			    y = 0;
			}			
		    }
		    else {
			x++;
			for (; y < grid.length; y++) {
			    for (; x < grid[y].length; x++) {
				if (grid[y][x].data('aclue') != null) {
				    grid[y][x].focus();
				    return false;
				}
			    }
			    x = 0;
			}			
			y = 0;
			for (; y < grid.length; y++) {
			    for (; x < grid[y].length; x++) {
				if (grid[y][x].data('aclue') != null) {
				    grid[y][x].focus();
				    return false;
				}
			    }
			    x = 0;
			}			
		    }
		    break;
		}
		break;

	    default:  

		if($('#debug-keys-' + tcgtDiv.attr('id') + ':checked').length)
		    alert(e.which + ',' + e.keyCode);
		break;
	    }
	    return false;
	});
	return box;
    }

    var methods = {

	init: function( options ) {
	    var settings = {
		width: 8,
		height: 8,
		mode: 'grid',
		tab: 99
	    };
	    if (options)
		$.extend(settings, options);
	    return this.each(function() {
		var it = $(this);
		var down = it.data('tcgtDown');
		var restore = (typeof settings.restore) == 'object';
		if (restore) {
		    settings.height = settings.restore.length;
		    settings.width = settings.restore[0].length;
		    if (!(settings.height > 1 && settings.width > 1)) {
			alert('Init "restore" data error: '+ settings.restore.toSource());
			return;
		    }
		    it.html(''); // clear out any old
		    down = null;
		}
		if (down == null) {
		    var grid = new Array();
		    for (var y = 0; y < settings.height; y++) {
			it.append(rowDiv);
			var row = $('.tcgtRow:last', it);
			grid[y] = new Array();
			for (var x = 0; x < settings.width; x++) {
			    row.append(boxDiv);
			    var box = $('.tcgt:last', row);
			    grid[y][x] = makeBox(box);
			    if (restore) {
				grid[y][x].html(settings.restore[y][x].L);
				grid[y][x].data('aclue', settings.restore[y][x].aclue);
				grid[y][x].data('dclue', settings.restore[y][x].dclue);
			    }
			}
		    }
		    var pfix = it.attr('id');
		    $('#dclue-in-'+pfix)
			.hide()
			.change(function() {
			    var it = $(this);
			    if (it.data('tcgtBox') != null) {
				it.data('tcgtBox').data('dclue', it.val());
			    }
			});
		    $('#aclue-in-'+pfix)
			.hide()
			.change(function() {
			    var it = $(this);
			    if (it.data('tcgtBox') != null) {
				it.data('tcgtBox').data('aclue', it.val());
			    }
			});
		    it.data({tcgtGrid: grid, 
			     tcgtDown: false, 
			     tcgtMode: settings.mode});
		    reIndex(it, 'grid');
		    $('.ui-state-default:first', it).focus();
		}
	    });
	},

	edge: function(edge, num) {
	    return this.each(function() {
		var it = $(this);
		if (it.data('tcgtMode') != 'grid') {
		    return;
		}
		var grid = it.data('tcgtGrid');
		switch (edge) {
		case 'top':
		    while (num > 0) {
			it.prepend(rowDiv);
			var row = $('.tcgtRow:first', it);
			var gRow = new Array();
			for (var x = 0; x < grid[1].length; x++) {
			    row.append(boxDiv);
			    gRow[x] = makeBox($('.tcgt:last', row));
			}
			grid.unshift(gRow);
			num--;
		    }
		    while (num < 0) {
			if (grid.length > 1) {
			    grid[0][0].parent().remove();
			    grid.shift();
			}
			num++;
		    }
		    break;
		case 'bottom':
		    while (num > 0) {
			it.append(rowDiv);
			var row = $('.tcgtRow:last', it);
			var gRow = new Array();
			for (var x = 0; x < grid[0].length; x++) {
			    row.append(boxDiv);
			    gRow[x] = makeBox($('.tcgt:last', row));
			}
			grid.push(gRow);
			num--;
		    }
		    while (num < 0) {
			if (grid.length > 1) {
			    grid[grid.length-1][0].parent().remove();
			    grid.pop();
			}
			num++;
		    }
		    break;
		case 'left':
		    while (num > 0) {
			for (var y = 0; y < grid.length; y++) {
			    grid[y][0].before(boxDiv);
			    grid[y].unshift(makeBox(grid[y][0].prev()));
			}
			num--;
		    }
		    while (num < 0) {
			if (grid[0].length > 1) {
			    for (var y = 0; y < grid.length; y++) {
				grid[y][0].remove();
				grid[y].shift();
			    }
			}
			num++;
		    }
		    break;
		case 'right':
		    while (num > 0) {
			for (var y = 0; y < grid.length; y++) {
			    var last = grid[y].length-1;
			    grid[y][last].after(boxDiv);
			    grid[y].push(makeBox(grid[y][last].next()));
			}
			num--;
		    }
		    while (num < 0) {
        		if (grid[0].length > 1) {
			    for (var y = 0; y < grid.length; y++) {
				grid[y][grid[y].length-1].remove();
				grid[y].pop();
			    }
			}
			num++;
		    }
		    break;
		}
		reIndex(it, 'grid');
		grid[0][0].focus();
	    });
	},

	mode: function (modeArg) {
	    return this.each(function() {
		var it = $(this);
		switch (modeArg) {
		case 'grid':
		case 'clue':
		case 'play':
		    break;
		default:
		    return;
		}
		var oldMode = it.data('tcgtMode');
		it.data('tcgtMode', modeArg);
		$('.tcgt:first', it).blur();
		reIndex(it, oldMode);
		$('.ui-state-default:first', it).focus();
	    });
	},

	post : function( url, name ) {
	    return this.each(function() {
		var o, p;
		var grid = $(this).data('tcgtGrid');
		if (grid != null) {
		    var g = new Array();
		    for (var y=0; y < grid.length; y++) {
			g[y] = new Array();
			for (var x=0; x < grid.length; x++) {
			    o = new Object;
			    o.L = grid[y][x].html();
			    p = grid[y][x].data('aclue');
			    if (p != null)
				o.aclue = p;
			    p = grid[y][x].data('dclue');
			    if (p != null)
				o.dclue = p;
			    g[y][x] = o;
			}	
		    }
		    //		    alert(url + '|' + name + '|' + g.toSource());
		    $.post(url, 
			   { name: name, tcgt: g.toSource() },
			   function(data) { alert(data); });
		}
	    });
	}
    };

    $.fn.tcgt = function( method ) {
	if ( methods[method] ) {
	    return methods[ method ]
		.apply( this, Array.prototype.slice.call( arguments, 1 ));
	} else if ( typeof method === 'object' || ! method ) {
	    return methods.init.apply( this, arguments );
	} else {
	    return $.error( 'Method ' +  method + ' does not exist in jQuery tegtCrossWord' );
	}    
    };

})( jQuery );
