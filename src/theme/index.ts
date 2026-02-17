import { borderRadius, colors, spacing } from '../constants';

export const theme = {
  colors,
  spacing,
  borderRadius,

  typography: {
    fontFamily: 'Plus Jakarta Sans',
    title: { fontSize: 24, fontWeight: '700' as const },
    subtitle: { fontSize: 18, fontWeight: '600' as const },
    body: { fontSize: 16 },
    caption: { fontSize: 14 },
    small: { fontSize: 12 },
  },
};
