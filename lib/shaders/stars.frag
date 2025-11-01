varying vec3 vColor;

void main() {
  // Create circular point
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);

  // Soft edge
  float alpha = 1.0 - smoothstep(0.3, 0.5, dist);

  // Add glow
  float glow = exp(-dist * 4.0);

  gl_FragColor = vec4(vColor, alpha * glow);
}
