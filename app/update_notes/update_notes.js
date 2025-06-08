const display_attic_dialog = require('../core/menu/attic_dialog');

async function get_update_text() {
    const res = await fetch('app/update_notes/latest_update');
    const data = await res.text();

    return data;
}

async function save_update() {
    const update = await get_update_text();

    localStorage.setItem('last_update', update);
}

/**
 * 
 * @param {boolean} force_display 
 */
async function get_last_update(force_display) {
    const last_update = localStorage.getItem('last_update');
    const new_update = await get_update_text();

    if (last_update != new_update || force_display) {
        display_attic_dialog({
            title: 'NEW UPDATE',
            body: new_update,
            color: '#5c9dff',
            textColor: 'black'
        });

        await save_update();
    }
}
get_last_update();

document.getElementById('armrUpdateBtn').addEventListener('click', () => {
    get_last_update(true);
});