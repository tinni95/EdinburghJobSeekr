
//function to open sidebar 
function openNav() {
    document.getElementById("mySidenav").style.display = "block";
}
//function to close sidebar
function closeNav() {
    document.getElementById("mySidenav").style.display = "none";
}
$(document).ready(function() {
//variables of RSS job types, start offset and length
//boolean ready is used to not trigger the infinite scrolling more than once
  var RSS="All";
  var startfrom=0;
  var ready=true;  
//when the page is opened for the first time
//we first assign the title to the current job displayed, in the start 'All'
$('#jobType').html(RSS);
//then we populate the page with the feeds of 'all' type of jobs
$.post('uno.php',
{rss:RSS, start:"0"}
,function(data){    
maximum=$(data).find('#max').text();
 $("#content").html(data);
}); 
//we create a function that could be call either when the buttons of the sidebar, and
//the primary menu are clicked, 
//this function is used to populate the first chunk of jobs(1-10)
  function popFeeds(event,e){
       event.stopImmediatePropagation();
       RSS=e.className;
       startfrom=0; 
       ready=true;
       $('#jobType').html(RSS);
       $(".loader").css("display","block");
       $("#scrollTop").css("display","none");
       $.post('uno.php',{rss:RSS, start:"0"},function(data){
       maximum=$(data).find('#max').text();
       $("#content").html(data);       
}); 
}
//listener function on all of the elements inside primary menu '#resources'     
//the listener could result as a double event that triggered it, one for the ul and one for the button
//to avoid that, we use event.stopImmediatePropagation() in the method popFeeds.
 $('#sources').on('click','*', function (event) {
popFeeds(event,this);
});
//listener function on all of the elements inside sidebar '#sources'      
 $('#resources').on('click','*', function (event) {
popFeeds(event,this);
});

$('#scrollTop').click(function(){
    $(window).scrollTop(0);
});
//function for the infinite scrolling, when the window is almost at the bottom of the page
//this function is triggered and the data is appended to the page
$(window).scroll(function () {
   if (ready&&$('body').height() <= ($(window).height() + $(window).scrollTop())+130) {
    ready=false;
    //when we reach the bottom of the page(almost), if there are other elements to load, we load it
if(startfrom<maximum-10){
       startfrom=startfrom+10;
       $.post('uno.php',{rss:RSS, start:startfrom},function(data){
       $("#content").append(data);
       ready=true;
}); 
   }
   //otherwise we make the loader invisible, and we insert an up arrow instead
   //which allow to go to top of the page
   else{
    $(".loader").css("display","none");
    $("#scrollTop").css("display","block");
}
}
});
});

