export const proceduralAtmosphereFragmentShader = `
precision highp float;

uniform float time;
uniform float speed;
uniform float opacity;
uniform float density;
uniform float scale;

uniform vec3 color;
uniform vec3 lightDirection;
uniform vec3 planetCenter;
uniform sampler2D pointTexture;

varying vec3 fragPosition;

void main() {
  float n = simplex3((time * speed) + fragPosition / scale);
  float baseAlpha = clamp(opacity * clamp(n + density, 0.0, 1.0), 0.0, 1.0);

  float distanceFromCamera = length(cameraPosition - fragPosition);
  float distanceFade = smoothstep(50.0, 15.0, distanceFromCamera);

  vec3 R = normalize(fragPosition - planetCenter);
  vec3 L = normalize(lightDirection);
  float light = max(0.08, dot(R, L));

  float alpha = baseAlpha * distanceFade;

  vec4 texColor = texture2D(pointTexture, gl_PointCoord);
  gl_FragColor = vec4(light * color * texColor.rgb, alpha * texColor.a);
}
`;
