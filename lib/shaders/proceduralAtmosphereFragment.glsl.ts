// Fragment Shader for Procedural Atmosphere Particles
// Uses noise-based density modulation and directional lighting

export const proceduralAtmosphereFragmentShader = `
precision highp float;

uniform float time;
uniform float speed;
uniform float opacity;
uniform float density;
uniform float scale;

uniform vec3 color;
uniform sampler2D pointTexture;

varying vec3 fragPosition;

vec2 rotateUV(vec2 uv, float rotation) {
    float mid = 0.5;
    return vec2(
        cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
        cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
}

void main() {
  float n = simplex3((time * speed) + fragPosition / scale);
  float baseAlpha = clamp(opacity * clamp(n + density, 0.0, 1.0), 0.0, 1.0);

  float distanceFromCamera = length(cameraPosition - fragPosition);
  float distanceFade = smoothstep(50.0, 15.0, distanceFromCamera);

  float alpha = baseAlpha * distanceFade;

  vec4 texColor = texture2D(pointTexture, gl_PointCoord);
  gl_FragColor = vec4(color * texColor.rgb, alpha * texColor.a);
}
`;
