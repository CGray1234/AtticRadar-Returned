const display_attic_dialog = require('../menu/attic_dialog');

$('#armrAboutBtn').click(function () {
    const html_content =
        `<div style="text-align: center; color: rgb(200, 200, 200)">
On June 6, 2025, the official AtticRadar website was shut down. The original developer, <a target="_blank" href="https://github.com/SteepAtticStairs/">SteepAtticStairs</a>, stated:
                    <img src="statement.png" style="width: 34rem;">

With the source code left open, I decided to make a fork of the original code and modify it to keep AtticRadar running. You can find the modified version (the source to this version) <a style="color: #53a2e0;" target="_blank" href="https://github.com/CGray1234/AtticRadar-Returned/">here</a>

Now, you may have already noticed that there have been some changes, and that change being the completely different map style.

Why is this you may ask?
Well the answer is because I switched from <a style="color: #53a2e0;" target="_blank" href="https://mapbox.com/">Mapbox</a> (which, to a point, is paid) to <a style="color: #53a2e0;" target="_blank" href="https://maplibre.org/">MapLibre</a> (which is free). I made this change because I don't want to have to pay for Mapbox, and MapLibre does all of the same things for free. I may add custom styles later on, but for now it will remain as this style.

Have any questions?
Feel free to DM me on Discord, my username is <code class="about_box_code">cgray.09</code>.
<hr>
Original AtticRadar info section:
<br/>
<div style="padding-left: 20px; padding-right: 20px; font-size: 20px"><b>Hey!</b></div>
Thanks for checking out my project AtticRadar!
This app was made by an independent developer - a (recently graduated) high school student.

You can find AtticRadar on Twitter: <a href="https://twitter.com/AtticRadar" style="color: #53a2e0;">@AtticRadar</a>
Be sure to check there for updates and general info about the project.

AtticRadar is free to use and doesn't have any ads. \
I hope that you enjoy the app, and feel free to shoot me a message on Twitter if you have a question! \
My email is also open: <a href="mailto:steepatticstairs@gmail.com" style="color: #53a2e0;">steepatticstairs@gmail.com</a> \
You can also message me on Discord; my username is <code class="about_box_code">steepatticstairs</code>.

Are you looking for AtticRadar's source code?
It's on GitHub! Check it out:
<a href="https://github.com/SteepAtticStairs/AtticRadar" style="color: #53a2e0;">https://github.com/SteepAtticStairs/AtticRadar</a>
I’d appreciate giving credit if you do find the code helpful!

Copyright © 2025 SteepAtticStairs. All rights reserved.
</div>
</div>`

    display_attic_dialog({
        'title': 'About',
        'body': html_content,
        'color': 'rgb(120, 120, 120)',
        'textColor': 'black',
    })
})