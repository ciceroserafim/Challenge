import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import commitInfo from '../commit-info.json';

export default function SobreApp({ navigation }) {
  const { colors } = useTheme();
  const { t, locale } = useI18n();

  const commitHash = commitInfo?.commitHash ?? t('about.commitUnavailable');

  const formattedDate = useMemo(() => {
    if (!commitInfo?.generatedAt) {
      return null;
    }

    try {
      if (typeof Intl === 'undefined') {
        return commitInfo.generatedAt;
      }

      return new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'pt-BR', {
        dateStyle: 'short',
        timeStyle: 'medium',
      }).format(new Date(commitInfo.generatedAt));
    } catch (error) {
      return commitInfo.generatedAt;
    }
  }, [locale]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.back, { color: colors.primary }]}>{t('about.back')}</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{t('about.title')}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.text }]}>
        <Text style={[styles.label, { color: colors.text }]}>{t('about.description')}</Text>

        <View style={styles.separator} />

        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('about.commitHash')}</Text>
        <Text selectable style={[styles.commitHash, { color: colors.text }]}>{commitHash}</Text>

        {formattedDate && (
          <>
            <View style={styles.separator} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('about.generatedAt')}</Text>
            <Text style={[styles.generatedAt, { color: colors.text }]}>{formattedDate}</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: {
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  placeholder: {
    width: 48,
  },
  card: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  label: {
    fontSize: 16,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  commitHash: {
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  generatedAt: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    opacity: 0.2,
    backgroundColor: '#aaa',
  },
});

