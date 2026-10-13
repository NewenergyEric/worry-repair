export const motionTokens = {
  duration: { instant: .08, fast: .18, normal: .35, slow: .6, crawl: 1 },
  easing: { smooth: [.22, 1, 0, 1] as const, sharp: [.4, 0, .2, 1] as const },
  distance: { xs: 4, sm: 8, md: 16, lg: 24, xl: 48 },
  scale: { subtle: .98, press: .95, pop: 1.04 },
};
export const springs = {
  snappy: { type: 'spring' as const, stiffness: 300, damping: 30 },
  gentle: { type: 'spring' as const, stiffness: 120, damping: 20 },
  release: { type: 'spring' as const, stiffness: 200, damping: 20, restDelta: .001 },
};
