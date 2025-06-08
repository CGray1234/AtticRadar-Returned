const turf = require('@turf/turf');
const format_value = require('./format_value');
const product_colors = require('../colormaps/colormaps');

function beam_height(distance_km, elevation_meters, elevation_angle) {
    var elevation = elevation_meters; // m
    var height = elevation / 1000; // km
    height = 0; // because we're doing ARL, not MSL
    var range = distance_km; // km
    var elevAngle = elevation_angle; // 0.5;
    var earthRadius = 6374; // km

    const radians = Math.PI / 180;

    /*
    // // Calculates the beam height MSL (mean sea level (this means above sea level)) in km.
    * Calculates the beam height ARL (above radar level) in ft.
    * Formula taken from https://wx.erau.edu/faculty/mullerb/Wx365/Doppler_formulas/doppler_formulas.pdf
    */
    var beamHeightARL = Math.sqrt(
        Math.pow(range, 2)
        +
        Math.pow((4 / 3) * earthRadius + height, 2)
        +
        (2 * range) * ((4 / 3) * earthRadius + height)
        *
        Math.sin(elevAngle * radians)
    ) - (4 / 3) * earthRadius;

    function km_to_kft(km) { return km * 3.28084 }
    function km_to_miles(km) { return km * 1.609 }
    function km_to_ft(km) { return km * 3280.8 }

    // var beamHeightKFT = km_to_kft(beamHeightMSL);
    // var beamHeightMI = km_to_miles(beamHeightMSL);
    var beamHeightFT = km_to_ft(beamHeightARL);

    return beamHeightFT;
}

function readPixels(gl, x, y) {
    var data = new Uint8Array(4);
    gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, data);
    return data;
}

// https://stackoverflow.com/a/73854666/18758797
// **NOW UPDATED FOR GLOBE SUPPORT**
// I'll admit, I did use a bit of AI for this.
function getValue(e) {
    const canvas = map.getCanvas();
    if (!canvas) {
        console.error('Canvas not found');
        return;
    }

    const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
    if (!gl || !window.atticData || !window.atticData.fb) {
        console.error('WebGL context or framebuffer not available');
        return;
    }

    const canvasWidth = parseFloat(canvas.style.width, 10);
    const canvasHeight = parseFloat(canvas.style.height, 10);

    const map_center = map.getCenter();

    var mapCenter = map.project(map_center);

    canvasX = mapCenter.x;
    canvasY = mapCenter.y;

    const bufferX = Math.floor(gl.drawingBufferWidth / canvasWidth * canvasX);
    const bufferY = Math.floor(gl.drawingBufferHeight / canvasHeight * (canvasHeight - canvasY));

    const withinBounds = bufferX >= 0 && bufferX < gl.drawingBufferWidth &&
        bufferY >= 0 && bufferY < gl.drawingBufferHeight;

    gl.bindFramebuffer(gl.FRAMEBUFFER, window.atticData.fb);

    var data = readPixels(gl, bufferX, bufferY);

    const centerX = Math.floor(gl.drawingBufferWidth / 2);
    const centerY = Math.floor(gl.drawingBufferHeight / 2);
    var centerData = readPixels(gl, centerX, centerY);

    const screenCenterX = Math.floor(canvasWidth / 2);
    const screenCenterY = Math.floor(canvasHeight / 2);
    const screenCenterBufferX = Math.floor(gl.drawingBufferWidth / canvasWidth * screenCenterX);
    const screenCenterBufferY = Math.floor(gl.drawingBufferHeight / canvasHeight * (canvasHeight - screenCenterY));
    var screenCenterData = readPixels(gl, screenCenterBufferX, screenCenterBufferY);

    const cmin = window.atticData.cmin;
    const cmax = window.atticData.cmax;

    var value, orig_value;
    if (cmin != undefined) {
        [value, orig_value] = format_value.decode_and_format(centerData, cmin, cmax);

        if (value == null) {
            $('#colorPickerText').hide();
        } else {
            $('#colorPickerText').show();
        }
        $('#colorPickerTextValue').text(value);
    }

    // Switch back to display framebuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    var color = `rgba(${screenCenterData[0]}, ${screenCenterData[1]}, ${screenCenterData[2]}, ${screenCenterData[3]})`;

    if (color != 'rgba(0, 0, 0, 0)') {
        var color_to_show;
        if (window.atticData.webgl_chroma_scale != undefined && orig_value != null) {
            const [r2, g2, b2, a2] = window.atticData.webgl_chroma_scale(parseFloat(orig_value)).rgba();
            color_to_show = `rgba(${r2}, ${g2}, ${b2}, ${a2})`;
        } else {
            color_to_show = color;
        }
        if (value == null) {
            color_to_show = color;
        }
        if (value == 'Range Folded') {
            color_to_show = product_colors.range_folded;
        }
        $('#colorPicker').css('background-color', color_to_show);
    } else {
        $('#colorPicker').css('background-color', 'rgba(0,0,0,255)');
    }

    // Rest of your beam height calculation...
    const radar_location = window.atticData.current_nexrad_location;
    if (radar_location != undefined) {
        const map_center_formatted = turf.point([map_center.lng, map_center.lat]);
        const radar_location_formatted = turf.point([radar_location[1], radar_location[0]]);
        const bearing = turf.bearing(map_center_formatted, radar_location_formatted);

        $('#radarCenterLine').css({
            '-webkit-transform': `rotate(${bearing}deg)`,
            '-moz-transform': `rotate(${bearing}deg)`,
            'transform': `rotate(${bearing}deg)`
        });

        const current_elevation_angle = window.atticData.current_elevation_angle;
        const distance_from_radar = turf.distance(map_center_formatted, radar_location_formatted, { units: 'kilometers' });
        const beam_height_calculated = beam_height(distance_from_radar, radar_location[2], current_elevation_angle);
        $('#colorPickerTextBeamHeight').text(`${beam_height_calculated.toFixed(0)} ft ARL`);
    }
}

module.exports = getValue;