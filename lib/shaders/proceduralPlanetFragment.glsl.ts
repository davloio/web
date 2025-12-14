export const proceduralPlanetFragmentShader = `
precision highp float;

uniform int type;
uniform float radius;
uniform float amplitude;
uniform float sharpness;
uniform float offset;
uniform float period;
uniform float persistence;
uniform float lacunarity;
uniform int octaves;

uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;
uniform vec3 color5;

uniform float transition2;
uniform float transition3;
uniform float transition4;
uniform float transition5;

uniform float blend12;
uniform float blend23;
uniform float blend34;
uniform float blend45;

uniform float bumpStrength;
uniform float bumpOffset;

uniform float ambientIntensity;
uniform float diffuseIntensity;
uniform float specularIntensity;
uniform float shininess;
uniform vec3 lightDirection;
uniform vec3 lightColor;

varying vec3 fragPosition;
varying vec3 fragNormal;
varying vec3 fragTangent;
varying vec3 fragBitangent;

void main() {
  float h = terrainHeight(
    type,
    fragPosition,
    amplitude,
    sharpness,
    offset,
    period,
    persistence,
    lacunarity,
    octaves);

  vec3 dx = bumpOffset * fragTangent;
  float h_dx = terrainHeight(
    type,
    fragPosition + dx,
    amplitude,
    sharpness,
    offset,
    period,
    persistence,
    lacunarity,
    octaves);

  vec3 dy = bumpOffset * fragBitangent;
  float h_dy = terrainHeight(
    type,
    fragPosition + dy,
    amplitude,
    sharpness,
    offset,
    period,
    persistence,
    lacunarity,
    octaves);

  vec3 pos = fragPosition * (radius + h);
  vec3 pos_dx = (fragPosition + dx) * (radius + h_dx);
  vec3 pos_dy = (fragPosition + dy) * (radius + h_dy);

  vec3 bumpNormal = normalize(cross(pos_dx - pos, pos_dy - pos));
  vec3 N = normalize(mix(fragNormal, bumpNormal, bumpStrength));

  vec3 L = normalize(-lightDirection);
  vec3 V = normalize(cameraPosition - pos);
  vec3 R = normalize(reflect(L, N));

  float diffuse = diffuseIntensity * max(0.0, dot(N, -L));

  float specularFalloff = clamp((transition3 - h) / transition3, 0.0, 1.0);
  float specular = max(0.0, specularFalloff * specularIntensity * 0.2 * pow(dot(V, R), shininess));

  float light = clamp(ambientIntensity + diffuse + specular, 0.0, 10.0);

  vec3 color12 = mix(
    color1,
    color2,
    smoothstep(transition2 - blend12, transition2 + blend12, h));

  vec3 color123 = mix(
    color12,
    color3,
    smoothstep(transition3 - blend23, transition3 + blend23, h));

  vec3 color1234 = mix(
    color123,
    color4,
    smoothstep(transition4 - blend34, transition4 + blend34, h));

  vec3 finalColor = mix(
    color1234,
    color5,
    smoothstep(transition5 - blend45, transition5 + blend45, h));

  vec3 litColor = clamp(light * finalColor * lightColor, 0.0, 1.0);
  gl_FragColor = vec4(litColor, 1.0);
}
`;
