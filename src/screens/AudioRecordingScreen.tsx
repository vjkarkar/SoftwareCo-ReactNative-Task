import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  AppState,
  Image,
  ImageBackground,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { theme } from '../theme';

let SoundModule: any = null;
try {
  SoundModule = require('react-native-nitro-sound').default;
} catch {
  // Native module not linked
}

type AudioState =
  | 'idle'
  | 'recording'
  | 'paused_recording'
  | 'playing'
  | 'paused_playing';

type Action = {
  key: string;
  label: string;
  icon: any;
  onPress: () => void;
  primary?: boolean;
};

const ICONS = {
  center: require('../assets/images/audio1.png'),
  mic: require('../assets/images/new_rcording.png'),
  play: require('../assets/images/play.png'),
  pause: require('../assets/images/pause.png'),
  stop: require('../assets/images/stop.png'),
  save: require('../assets/images/save.png'),
};

const formatDuration = (milliseconds: number) => {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const AudioRecordingScreen: React.FC = () => {
  const Sound = SoundModule;
  const [audioState, setAudioState] = useState<AudioState>('idle');
  const [recordMs, setRecordMs] = useState(0);
  const [playMs, setPlayMs] = useState(0);
  const [recordedPath, setRecordedPath] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const audioStateRef = useRef<AudioState>('idle');

  useEffect(() => {
    audioStateRef.current = audioState;
  }, [audioState]);

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Audio Recording Permission',
            message:
              'This app needs access to your microphone to record audio.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        const ok = granted === PermissionsAndroid.RESULTS.GRANTED;
        setPermissionGranted(ok);
        return ok;
      } catch {
        setPermissionGranted(false);
        return false;
      }
    }
    setPermissionGranted(true);
    return true;
  };

  useEffect(() => {
    if (!Sound) return;
    const sub = AppState.addEventListener('change', async nextState => {
      const current = audioStateRef.current;
      if (nextState === 'background' || nextState === 'inactive') {
        try {
          if (current === 'recording') {
            await Sound.pauseRecorder();
            Sound.removeRecordBackListener();
            setAudioState('paused_recording');
          } else if (current === 'playing') {
            await Sound.pausePlayer();
            Sound.removePlayBackListener();
            setAudioState('paused_playing');
          }
        } catch {
          // noop
        }
      }
    });

    return () => {
      sub.remove();
      try {
        Sound.removeRecordBackListener();
        Sound.removePlayBackListener();
        Sound.removePlaybackEndListener?.();
      } catch {
        // noop
      }
    };
  }, [Sound]);

  const attachRecordListener = () => {
    if (!Sound) return;
    Sound.addRecordBackListener((e: any) => {
      const ms = Math.max(0, e.currentPosition || 0);
      setRecordMs(ms);
    });
  };

  const attachPlayListener = () => {
    if (!Sound) return;
    Sound.addPlayBackListener((e: any) => {
      const ms = Math.max(0, e.currentPosition || 0);
      setPlayMs(ms);
    });
  };

  const startRecord = async () => {
    if (!Sound) return;
    if (!permissionGranted && !(await requestPermission())) {
      Alert.alert('Permission Required', 'Microphone permission is required.');
      return;
    }
    try {
      setPlayMs(0);
      setRecordMs(0);
      await Sound.startRecorder(undefined, undefined, true);
      attachRecordListener();
      setAudioState('recording');
    } catch {
      setAudioState('idle');
    }
  };

  const pauseResumeRecord = async () => {
    if (!Sound) return;
    try {
      if (audioState === 'recording') {
        await Sound.pauseRecorder();
        Sound.removeRecordBackListener();
        setAudioState('paused_recording');
      } else if (audioState === 'paused_recording') {
        await Sound.resumeRecorder();
        attachRecordListener();
        setAudioState('recording');
      }
    } catch {
      setAudioState('idle');
    }
  };

  const stopRecord = async () => {
    if (!Sound) return;
    try {
      const result = await Sound.stopRecorder();
      Sound.removeRecordBackListener();
      const path =
        typeof result === 'string' ? result : (result as any)?.path || null;
      setRecordedPath(path);
      setAudioState('idle');
    } catch {
      setAudioState('idle');
    }
  };

  const startPlay = async () => {
    if (!Sound || !recordedPath) return;
    try {
      setPlayMs(0);
      await Sound.startPlayer(recordedPath);
      attachPlayListener();
      Sound.addPlaybackEndListener?.(() => {
        setAudioState('idle');
        setPlayMs(0);
        Sound.removePlayBackListener();
        Sound.removePlaybackEndListener?.();
      });
      setAudioState('playing');
    } catch {
      setAudioState('idle');
    }
  };

  const pauseResumePlay = async () => {
    if (!Sound) return;
    try {
      if (audioState === 'playing') {
        await Sound.pausePlayer();
        Sound.removePlayBackListener();
        setAudioState('paused_playing');
      } else if (audioState === 'paused_playing') {
        await Sound.resumePlayer();
        attachPlayListener();
        setAudioState('playing');
      }
    } catch {
      setAudioState('idle');
    }
  };

  const stopPlay = async () => {
    if (!Sound) return;
    try {
      await Sound.stopPlayer();
      Sound.removePlayBackListener();
      Sound.removePlaybackEndListener?.();
      setAudioState('idle');
      setPlayMs(0);
    } catch {
      setAudioState('idle');
    }
  };

  const saveRecording = async () => {
    if (!Sound) return;
    try {
      if (audioState === 'recording' || audioState === 'paused_recording') {
        await Sound.stopRecorder();
        Sound.removeRecordBackListener();
      }
      if (audioState === 'playing' || audioState === 'paused_playing') {
        await Sound.stopPlayer();
        Sound.removePlayBackListener();
        Sound.removePlaybackEndListener?.();
      }
    } catch {
      // Continue with reset even if native stop fails
    }

    // Reset screen to initial state after save
    setRecordedPath(null);
    setRecordMs(0);
    setPlayMs(0);
    setAudioState('idle');
  };

  const getLottieSource = () => {
    if (audioState === 'recording') {
      return require('../../assets/lottie/recording.json');
    }
    if (audioState === 'paused_recording' || audioState === 'paused_playing') {
      return require('../../assets/lottie/paused.json');
    }
    if (audioState === 'playing') {
      return require('../../assets/lottie/playing.json');
    }
    return require('../../assets/lottie/idle.json');
  };

  const displayTime =
    audioState === 'recording' || audioState === 'paused_recording'
      ? formatDuration(recordMs)
      : audioState === 'playing' || audioState === 'paused_playing'
        ? formatDuration(playMs)
        : recordMs > 0
          ? formatDuration(recordMs)
          : '00:00:00';

  const actions: Action[] = (() => {
    if (
      audioState === 'recording' ||
      audioState === 'paused_recording' ||
      audioState === 'playing' ||
      audioState === 'paused_playing'
    ) {
      const isRecordingFlow =
        audioState === 'recording' || audioState === 'paused_recording';
      return [
        {
          key: 'pause',
          label: 'Pause',
          icon:
            audioState === 'paused_recording' || audioState === 'paused_playing'
              ? ICONS.play
              : ICONS.pause,
          onPress: isRecordingFlow ? pauseResumeRecord : pauseResumePlay,
        },
        {
          key: 'stop',
          label: 'Stop',
          icon: ICONS.stop,
          onPress: isRecordingFlow ? stopRecord : stopPlay,
        },
        {
          key: 'save',
          label: 'Save',
          icon: ICONS.save,
          onPress: saveRecording,
        },
      ];
    }

    if (recordedPath) {
      return [
        { key: 'play', label: 'Play', icon: ICONS.play, onPress: startPlay },
        { key: 'save', label: 'Save', icon: ICONS.save, onPress: saveRecording },
      ];
    }

    return [
      {
        key: 'new',
        label: 'New\nRecording',
        icon: ICONS.mic,
        onPress: startRecord,
        primary: true,
      },
    ];
  })();

  if (!Sound) {
    return (
      <View style={styles.container}>
        <Text style={styles.fallbackTitle}>Audio Recording</Text>
        <Text style={styles.fallbackText}>
          Audio recording requires react-native-nitro-sound. Rebuild app after
          native setup.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.centerWrap}>
        <ImageBackground source={ICONS.center} style={styles.centerBg}>
          <LottieView
            source={getLottieSource()}
            autoPlay
            loop
            style={styles.lottie}
          />
        </ImageBackground>
      </View>

      <Text style={styles.timerText}>{displayTime}</Text>

      <View style={styles.actionRow}>
        {actions.map(action => (
          <View key={action.key} style={styles.actionCol}>
            <Text style={styles.actionLabel}>{action.label}</Text>
            <TouchableOpacity
              style={[styles.actionBtn, action.primary && styles.primaryActionBtn]}
              onPress={action.onPress}
              activeOpacity={0.8}
            >
              <Image source={action.icon} style={styles.actionIcon} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F7',
    alignItems: 'center',
    paddingTop: 54,
  },
  centerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  centerBg: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 56,
    height: 56,
  },
  timerText: {
    fontSize: 34,
    fontWeight: '600',
    color: '#102A4C',
    marginTop: 24,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 18,
    marginTop: 26,
  },
  actionCol: {
    width: 62,
    alignItems: 'center',
  },
  actionLabel: {
    minHeight: 26,
    textAlign: 'center',
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 13,
    marginBottom: 8,
  },
  actionBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#C6D5E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryActionBtn: {
    backgroundColor: '#AFC4DA',
  },
  actionIcon: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
  fallbackTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginTop: 24,
  },
  fallbackText: {
    marginTop: 10,
    color: theme.colors.textSecondary,
    paddingHorizontal: 24,
    textAlign: 'center',
  },
});

export default AudioRecordingScreen;
