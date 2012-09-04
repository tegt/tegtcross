#! /usr/bin/php 
<?php
  /** Usage: ./weave.php relUrl "Title line" "Sub-title line" <wordlist.txt
   *    
   *   relUrl - The relative url for the oy libraries 
   *   "Title line" - At top of  crossword block
   *   "Sub-title line" - Second line of crossword block
   *   wordlist.txt - stdin text file with word blank clue per line
   */
include '/tdtg/inc/cmdline.inc';

function hmac ($key, $data)
{
    // RFC 2104 HMAC implementation for php.
    // Creates an md5 HMAC.
    // Eliminates the need to install mhash to compute a HMAC
    // Hacked by Lance Rushing

    $b = 64; // byte length for md5
    if (strlen($key) > $b) {
        $key = pack("H*",md5($key));
    }
    $key  = str_pad($key, $b, chr(0x00));
    $ipad = str_pad('', $b, chr(0x36));
    $opad = str_pad('', $b, chr(0x5c));
    $k_ipad = $key ^ $ipad ;
    $k_opad = $key ^ $opad;

    return md5($k_opad  . pack("H*",md5($k_ipad . $data)));
}

// parse args
if ($argc <> 4) usage(__file__);

// read the word-clue list
while (($line = trim(fgets(STDIN))) != '') {
    list($word[], $def[]) = explode(' ', $line, 2);
 }
file_put_contents('/tmp/wdlist',implode("\n",$word));
$board = strtr(shell_exec("./jigsaw /tmp/wdlist"),'-',' ');
echo $board;
$lines = explode("\n",$board);
$x = 0;
foreach ($lines as $line) {
    $l = rtrim($line);
    $nl = strlen($l);
    if ($nl) {
        $tlines[] = $l;
        $x = max($x, $nl);
    }
}

// output the js data header
$y = count($tlines);
$key = md5(date('r'));
fprintf(STDOUT,"var oygCrosswordPuzzle = new oyCrosswordPuzzle (
    \"$key\", \"$argv[1]\", \"crosscookie\",
    \"$argv[2]\",
    \"$argv[3]\", [
");

// output the js word and clue data
$sep = ',';
for ($i=0; $i < count($word); $i++) {
    if ($i == count($word)-1) $sep = '';
    fprintf (STDOUT, "        new oyCrosswordClue(%d, 
        \"%s\", 
        \"%s\", \"%s\", 1, 12, 6)$sep
", strlen($word[$i]), $def[$i], $word[$i],hmac($key,$word[$i]));
 }

// close th js data
fprintf(STDOUT,"  ], $x, $y);
");

?>