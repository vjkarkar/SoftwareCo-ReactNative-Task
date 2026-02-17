export const theme = {
  colors: {
    primary: '#1E3A5F',
    primaryLight: '#2563EB',
    accent: '#60A5FA',

    background: '#FFFFFF',
    surface: '#F8FAFC',

    textPrimary: '#1E293B',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',

    border: '#E2E8F0',

    error: '#DC2626',
    success: '#16A34A',
    warning: '#F59E0B',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    full: 9999,
  },

  typography: {
    fontFamily: 'Plus Jakarta Sans',
    title: { fontSize: 24, fontWeight: '700' as const },
    subtitle: { fontSize: 18, fontWeight: '600' as const },
    body: { fontSize: 16 },
    caption: { fontSize: 14 },
    small: { fontSize: 12 },
  },
};
