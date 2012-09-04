<?php
$f = $_REQUEST['f']==''? 'play': $_REQUEST['f'];
$json = file_get_contents('save/'.$f);
echo <<<HERE_HTML
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strick.dtd"> 
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />

    <link rel="stylesheet" type="text/css" media="screen" href="css/tegtcross.css"/>
    <link rel="stylesheet" type="text/css" media="screen" href="css/le-frog/jquery-ui-1.8.9.custom.css"/>
    <link rel="stylesheet" type="text/css" media="screen" href="css/tegtword/jquery-ui-1.8.9.custom.css"/>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js" 
	    type="text/javascript"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.9/jquery-ui.min.js" 
	    type="text/javascript"></script>
    <script src="js/tcgt.js" type="text/javascript"></script>
    <script type="text/javascript">
      $(function(){
	  $('.grid').hide();
	  $('#tegtword').tcgt('init',{ mode: 'play',
				       restore: $json });
      });
    </script>

    <title>Tegtcross Word test</title>
  </head>
  <body class="ui-widget">

    <p>Test container for tegtCross div</p>
    <button onclick="$('.grid').show();$('#tegtword').tcgt('mode','grid')">words</button>
    <button onclick="$('.grid').hide();$('#tegtword').tcgt('mode','clue')">clues</button>
    <button onclick="$('.grid').hide();$('#tegtword').tcgt('mode','play')">play</button>
    <input type="checkbox" id="debug-keys-tegtword" value="debugKeys" />Debug Keyboard
    <table style="margin: auto; border: 2px solid black;">
      <tr><td colspan="3" align="center">
	  <button class="grid" onclick="$('#tegtword').tcgt('edge','top',1)">+</button>
	  <button class="grid" onclick="$('#tegtword').tcgt('edge','top',-1)">-</button>
      </td></tr>
      <tr><td>
	  <button class="grid" onclick="$('#tegtword').tcgt('edge','left',1)">+</button>
	  <button class="grid" onclick="$('#tegtword').tcgt('edge','left',-1)">-</button>
	</td><td>
	  <div id="tegtword" class="ui-widget"/>
	</td><td>
	  <button class="grid" onclick="$('#tegtword').tcgt('edge','right',1)">+</button>
	  <button class="grid" onclick="$('#tegtword').tcgt('edge','right',-1)">-</button>
      </td></tr>
      <tr><td colspan="3" align="center">
	<button class="grid" onclick="$('#tegtword').tcgt('edge','bottom',1)">+</button>
	<button class="grid" onclick="$('#tegtword').tcgt('edge','bottom',-1)">-</button>
    </td></tr></table>
    <table style="margin: auto">
      <tr><td>
	  <div style="min-height:3.5em; min-width:40em; border: 2px solid black; padding: 4px;">
	    <div id="aclue-tegtword"></div>
	    <div class="ui-state-disabled" style="display: inline; margin-left:10%">Across</div>
	    <input type="text" size="80" id="aclue-in-tegtword" />
	    <div id="aclue-text-tegtword" class="ui-state-highlight" style="clear:left"></div>
	  </div>
      </td></tr><tr><td>
	  <div style="min-height:3.5em; min-width:40em; border: 2px solid black; padding: 4px;">
	    <div id="dclue-tegtword"></div>
	    <div class="ui-state-disabled" style="display: inline; margin-left:10%">Down</div>
	    <input type="text" size="80" id="dclue-in-tegtword" />
	    <div id="dclue-text-tegtword" class="ui-state-highlight" style="clear:left"></div>
	  </div>
      </td></tr><tr><td>
	  <br/>
	  Filename: <input type="text" size="12" id="nameIt" value="$f"/></td></tr>
      <tr><td>
	  <button onclick="$('#tegtword').tcgt('post','tcgtpost.php',$('#nameIt').val())">
	    Save Crossword</button></td></tr>
    </table>
  </body>
</html>
HERE_HTML;
?>
