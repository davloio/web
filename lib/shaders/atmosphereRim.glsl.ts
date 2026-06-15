export const atmosphereRimVertexShader = `
precision highp float;

varying vec3 vWorldNormal;
varying vec3 vViewPosition;

void main() {
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const atmosphereRimFragmentShader = `
precision highp float;

uniform vec3 rimColor;
uniform float rimIntensity;
uniform float fresnelPower;
uniform vec3 lightDirection;

varying vec3 vWorldNormal;
varying vec3 vViewPosition;

void main() {
  vec3 viewDirection = normalize(vViewPosition);
  vec3 worldNormal = normalize(vWorldNormal);

  vec3 viewNormal = normalize((viewMatrix * vec4(worldNormal, 0.0)).xyz);
  float dotProduct = clamp(abs(dot(viewNormal, viewDirection)), 0.0, 1.0);
  float fresnel = pow(1.0 - dotProduct, fresnelPower);

  float smoothFalloff = smoothstep(0.0, 1.0, fresnel);
  float gradientFalloff = fresnel * fresnel;

  float dayFactor = clamp(dot(worldNormal, normalize(lightDirection)) * 0.6 + 0.4, 0.05, 1.0);

  float alpha = clamp(smoothFalloff * gradientFalloff * rimIntensity * dayFactor, 0.0, 1.0);

  gl_FragColor = vec4(rimColor, alpha);
}
`;
