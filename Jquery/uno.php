<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
//require once simplepie library
require_once('php/autoloader.php');
//our feeds arrays
require_once('feeds.php');
$feed = new SimplePie();
$RSS    = $_POST['rss'];
$start  = $_POST['start'];
$length = 10;
//we set our feeds to parse to an array which variable name is one of the possible
//rss values past with post
$feed->set_feed_url(${$RSS});
$success = $feed->init();
// Make sure the page is being served with the right headers.
$feed->handle_content_type();
?>
<!DOCTYPE html>
 
<body>
<div id="site">
    <?php
if ($success):
// assigning every feed to an array which every value has as key the title
    
// in this way title duplicates will be overridden automatically
    $arrFeedStack = array();
    foreach ($feed->get_items() as $property):
    $arrFeedStack[$property->get_title()] = $property;
    endforeach;
    //we slice the array for the chank we need to return in the Ajax call
    $ITEM = array_slice($arrFeedStack, $start, $length);
    //count number of total items    
    $max  = count($arrFeedStack);
    //what we are going to do for every item
    foreach ($ITEM as $item):
        $feed = $item->get_feed();
?>
 <div id="chunk" >
 <hr>
 //get favicon of the rss source
  <h3><img src="<?php echo $feed->get_favicon();?>" class="favicon"><?php
        if ($item->get_permalink())
            echo '<a href="' . $item->get_permalink() . '">';
        echo $item->get_title(true);
        if ($item->get_permalink())
            echo '</a>';
?></h3>
                
                <hr>

        
        
                <?php
        echo $item->get_content();
?>
                                     
                <hr>
                    <p>Source: <a href="<?php
        echo $feed->get_permalink();
?>"><?php
        echo $feed->get_title();
?></a> | <?php
        echo $item->get_date('j M Y, g:i a');
?></p>
            </div> 
        <?php
    endforeach;
?>
   <?php
endif;
?>
    <?php
//pagination handled here
$next = (int) $start + (int) $length;
$prev = (int) $start - (int) $length;

$begin = (int) $start + 1;
$end   = ($next > $max) ? $max : $next;
?>
   <div id="chunk">
    <br>
     <h3><p>Showing <?php
echo $start + 1;
?>&ndash;<?php
echo $end;
?> out of <span id="max"><?php
echo $max;
?> </span>...</h3>
     </div>
     <br>
</body>
</html>