<?php
$fin = $argv[1];
echo $fin."\n";
$c = file_get_contents($fin);
$gz = gzdeflate($c);
$uu = base64_encode($gz);
$h = 'http://tegt.com?t='.$uu."\n";
$cl = strlen($c);
$gzl = strlen($gz);
$uul = strlen($uu);
$hl = strlen($h);
echo ("c:$cl; gz:$gzl; uu:$uul; h:$hl\n\n$h\n\n$c\n\n");
?>