export const proceduralAtmosphereVertexShader = `
precision highp float;

attribute float size;

varying vec3 fragPosition;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  float attenuation = clamp(6.0 / -mvPosition.z, 0.3, 1.8);
  gl_PointSize = size * attenuation;
  gl_Position = projectionMatrix * mvPosition;
  fragPosition = (modelMatrix * vec4(position, 1.0)).xyz;
}
`;
