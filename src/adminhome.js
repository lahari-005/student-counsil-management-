import React from 'react'
import './home.css'
import logouticon from './images/logout.png'
import srmlogoicon from './images/srmlogo3.png'
import adminaccount from './images/adminaccount.jpg'
import {callApi,getSession,setSession,errorResponse } from './main';

export function loadMenu(res)
{
    var data = JSON.parse(res);
    var menuitems = "";
    menuitems += `<li>
                    <label id='homeL' style='padding-left: 10px;' > Home <i class="menuhome-icon"></i> </label>
                  </li>`;
    for(var x in data)
    {
        menuitems += `<li >
                        <label id='${data[x].mid}L' >${data[x].mtitle} <i class="dropdown-icon"></i> </label>
                        <div id='${data[x].mid}' class='smenu' ></div>
                      </li>`;
    }
    var mlist = document.getElementById('mlist');
    mlist.innerHTML = menuitems;
    document.getElementById('homeL').addEventListener("click", loadHomeModule);
    for ( x in data) {
        var menuLabel = document.getElementById(`${data[x].mid}L`);
        menuLabel.addEventListener("click", function (mid) {
            return function () {
                var dropdownIcon = this.querySelector('.dropdown-icon');
                dropdownIcon.classList.toggle('rotated');
                showSMenu(mid);
            };
        }(data[x].mid));
    }
}

export function loadHomeModule() {
    var titlebar = document.getElementById('titlebar');
    var module = document.getElementById('module');
 
    // Set the content for the "Home" module
    module.src = "/ahome";
    titlebar.innerText = "Admin Home"; // Change the title to indicate the home page
    module.className = 'module-home'; // Apply a specific class for styling if needed
 }

 export function showSMenu(mid) {
    var surl = "http://localhost:5000/adminhome/adminmenus";
    var ipdata = JSON.stringify({
        mid: mid
    });

    // Close any open submenus with animation
    var openSubmenus = document.querySelectorAll('.smenu');
    openSubmenus.forEach(smenu => {
        if (smenu.id !== mid && smenu.classList.contains('active')) {
            smenu.style.maxHeight = '0'; // Ensure the menu is closed
            setTimeout(() => {
                smenu.classList.remove('active'); // Remove active class after closing
            }, 900); // Adjust the timeout to match transition duration

            // Reset rotation for the dropdown icon in closed submenu
            var menuLabel = document.getElementById(`${smenu.id}L`);
            if (menuLabel) {
                var dropdownIcon = menuLabel.querySelector('.dropdown-icon');
                dropdownIcon.classList.remove('rotated');
            }
        }
    });

    // Check if the clicked menu is already active
    var clickedMenu = document.getElementById(mid);
    if (clickedMenu.classList.contains('active')) {
        clickedMenu.style.maxHeight = '0'; // Close the submenu
        setTimeout(() => {
            clickedMenu.classList.remove('active'); // Remove active class after closing
        }, 900); // Adjust the timeout to match transition duration

        // Reset rotation for the dropdown icon in closed submenu
        var menuLabel = document.getElementById(`${mid}L`);
        if (menuLabel) {
            var dropdownIcon = menuLabel.querySelector('.dropdown-icon');
            dropdownIcon.classList.remove('rotated');
        }
    } else {
        // Show loading indicator while fetching submenu data
        var smenu = document.getElementById(mid);

        callApi("POST", surl, ipdata, function(res) {
            loadSMenu(res);
            // After loading submenu data, open the submenu with animation
            setTimeout(() => {
                smenu.style.maxHeight = smenu.scrollHeight + 'px'; // Set max-height to show the menu
                smenu.classList.add('active'); // Add active class after opening

                // Rotate the dropdown icon for the opened submenu
                var menuLabel = document.getElementById(`${mid}L`);
                if (menuLabel) {
                    var dropdownIcon = menuLabel.querySelector('.dropdown-icon');
                    dropdownIcon.classList.add('rotated');
                }
            }, 100); // Add a small delay before adjusting max-height
        }, errorResponse);
    }
}




export function loadSMenu(res) {
    var data = JSON.parse(res);
    var smenuitems = "";
    for (var x in data) {
        smenuitems += `<label id='${data[x].smid}' class='submenu-item' data-description='${data[x].description}'>${data[x].smtitle} <i class="smenudropdown-icon"></i></label>`;
    }
    var smenu = document.getElementById(`${data[x].mid}`);
    smenu.innerHTML = smenuitems;

    for (x in data) {
        var submenuItem = document.getElementById(`${data[x].smid}`);
        submenuItem.addEventListener("click", loadModule.bind(null, data[x].smid)); // Add click event listener
        submenuItem.addEventListener("mouseover", showDescription.bind(null, submenuItem)); // Add mouseover event listener
        submenuItem.addEventListener("mouseout", hideDescription); // Add mouseout event listener
    }
}

// Function to show the description tooltip
function showDescription(element) {
    var description = element.getAttribute('data-description');
    var tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = description;
    element.appendChild(tooltip);
}

// Function to hide the description tooltip
function hideDescription(event) {
    var tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(tooltip => tooltip.remove());
}


export function loadModule(smid)
{
   var titlebar = document.getElementById('titlebar');
   var module = document.getElementById('module');

   switch(smid)
   {
        case "00201":
            
            module.src = "/addstudent";
            titlebar.innerText = "Create Account for Student";
            break;

        case "00202":
            
            module.src = "/viewstudent";
            titlebar.innerText = "View Students Details";
            break;

        case "00301":
            
            module.src = "/addcounsellor";
            titlebar.innerText = "Create Account for Counsellor";
            break;

        case "00302":
            
            module.src = "/viewcounsellor";
            titlebar.innerText = "View  Counsellors Details";
            break;

        case "00304":
            
            module.src = "/deletecounsellor";
            titlebar.innerText = "Delete  Counsellor Account";
            break;

        case "00303":
            
            module.src = "/updatecounsellor";
            titlebar.innerText = "Update Counsellor Details";
            break;

        case "00204":
            
            module.src = "/deletestudent";
            titlebar.innerText = "Delete  Student Account";
            break;

        case "00203":
            
            module.src = "/updatestudent";
            titlebar.innerText = "Update Student Details";
            break;

        case "00401":
            
            module.src = "/assigncounsellor";
            titlebar.innerText = "Assign Counsellor for Students";
            break;
        
        default:
            module.src = "";
            titlebar.innerText = "";
   }
   module.className = 'module-' + smid;
}

class AdminHome extends React.Component
{

    constructor(props) {
        super()
        this.aid =getSession("aid");
        //alert(this.aid);
        if(this.aid ==="")
            window.location.replace("/");

        var url = "http://localhost:5000/adminhome/adminmenu";
        callApi("POST", url, "", loadMenu, loadMenuError);
    }

    componentDidMount() {
        
        loadHomeModule();
    }
    logout()
    {   
        setSession("aid","",-1);
        window.location.replace("/");
    }
    

    render()
    {
        return(
            <div className='full-height'>
              
                <div className='firstheader'>
                <a href='https://www.srmuniversity.in/' target="_blank" rel="noreferrer"><img src={srmlogoicon} alt='' className='HS6' /></a>


                    <label className='HS5'>Admin Portal </label>
                    <label className='HS7'>- SMS</label>
                    <label className='HS4'>ADMIN</label>
                    <img src={adminaccount} alt='' className='HS9'/>
                </div>
                <div className='secondheader'> 
                <label className='HS2' onClick={this.logout}>Logout</label>
                    <img src={logouticon} alt='' className='HS3' onClick={this.logout} />
                </div>
            
                <div className='content'>
                    <div className='menubar'>
                    
                        <div className='menu'>
                            <nav><ul id='mlist' className='mlist'></ul></nav>
                        </div>
                        </div>
                    <div className='outlet'>
                    <div id='titlebar'></div>
                        <iframe id='module' src="" title="Module iframe"></iframe> 
                    </div>
                    
                </div>
                <div className='footer'>
                © Copyright 2025 by SRM University. All Rights Reserved
                </div>
            </div>
        );
    }
}

export default AdminHome;
export function loadMenuError(res) {
    
    console.error("Error occurred while loading menu:", res);
}