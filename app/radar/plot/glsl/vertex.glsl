uniform mat4 u_matrix;
// uniform vec4 u_eye_high;
// uniform vec4 u_eye_low;
attribute vec2 aPosition;
uniform vec2 radarLatLng;
attribute float aColor;
varying float color;

void main() {
    //gl_Position = u_matrix * vec4(aPosition.x, aPosition.y, 0.0, 1.0);
    gl_Position = projectTile(aPosition);
    color = aColor;
}