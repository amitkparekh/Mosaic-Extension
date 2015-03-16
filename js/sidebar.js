// Sidebar toggle
//
// -------------------
    var sidebar = document.getElementById("sidebar");
    var menuButton = document.getElementById("menu-button");
    
    var sidebarToggle = function() {
        if ( sidebar.className.match(/(?:^|\s)open(?!\S)/) ) {
            sidebar.className = sidebar.className.replace( /(?:^|\s)open(?!\S)/g , '' )
        } else {
            sidebar.className += " open";
        };
        
        if ( menuButton.className.match(/(?:^|\s)active(?!\S)/) ) {
            menuButton.className = menuButton.className.replace( /(?:^|\s)active(?!\S)/g , '' )
        } else {
            menuButton.className += " active";
        }      
    };

    menuButton.addEventListener("click", sidebarToggle);