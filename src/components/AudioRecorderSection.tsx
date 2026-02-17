import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    PermissionsAndroid,
    AppState,
} from 'react-native';
import LottieView from 'lottie-react-native';

let SoundModule: any = null;
try {
    SoundModule = require('react-native-nitro-sound').default;
} catch {
    // Native module not linked - will show fallback UI
}

type AudioState =
    | 'idle'
    | 'recording'
    | 'paused_recording'
    | 'playing'
    | 'paused_playing';

const AudioRecorderSection: React.FC = () => {
    const [audioState, setAudioState] = useState<AudioState>('idle');
    const [recordTime, setRecordTime] = useState('0:00');
    const [playTime, setPlayTime] = useState('0:00');
    const [recordedPath, setRecordedPath] = useState<string | null>(null);
    const [permissionGranted, setPermissionGranted] = useState(false);

    const Sound = SoundModule;

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
                setPermissionGranted(granted === PermissionsAndroid.RESULTS.GRANTED);
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch {
                setPermissionGranted(false);
                return false;
            }
        }
        setPermissionGranted(true);
        return true;
    };

    useEffect(() => {
        requestPermission();
    }, []);

    useEffect(() => {
        if (!Sound || audioState !== 'recording') return;
        const subscription = AppState.addEventListener('change', nextState => {
            if (nextState === 'background') {
                Sound.pauseRecorder().then(() => setAudioState('paused_recording'));
            }
        });
        return () => subscription?.remove();
        // eslint-disable-next-line react-hooks/exhaustive-deps -- Sound from conditional require
    }, [audioState]);

    const onStartRecord = async () => {
        if (!Sound) return;
        if (!permissionGranted && !(await requestPermission())) return;
        try {
            setAudioState('recording');
            await Sound.startRecorder(undefined, undefined, true);
            Sound.addRecordBackListener((e: any) => {
                setRecordTime(Sound.mmss(Math.floor(e.currentPosition)));
            });
        } catch {
            setAudioState('idle');
        }
    };

    const onPauseRecord = async () => {
        if (!Sound) return;
        try {
            await Sound.pauseRecorder();
            Sound.removeRecordBackListener();
            setAudioState('paused_recording');
        } catch {
            setAudioState('idle');
        }
    };

    const onResumeRecord = async () => {
        if (!Sound) return;
        try {
            await Sound.resumeRecorder();
            Sound.addRecordBackListener((e: any) => {
                setRecordTime(Sound.mmss(Math.floor(e.currentPosition)));
            });
            setAudioState('recording');
        } catch {
            setAudioState('idle');
        }
    };

    const onStopRecord = async () => {
        if (!Sound) return;
        try {
            const result = await Sound.stopRecorder();
            Sound.removeRecordBackListener();
            setRecordedPath(
                typeof result === 'string' ? result : (result as any)?.path,
            );
            setAudioState('idle');
            setRecordTime('0:00');
        } catch {
            setAudioState('idle');
        }
    };

    const onStartPlay = async () => {
        if (!Sound || !recordedPath) return;
        try {
            setAudioState('playing');
            await Sound.startPlayer(recordedPath);
            Sound.addPlayBackListener((e: any) => {
                setPlayTime(Sound.mmss(Math.floor(e.currentPosition)));
            });
            Sound.addPlaybackEndListener(() => {
                setAudioState('idle');
                setPlayTime('0:00');
                Sound.removePlayBackListener();
                Sound.removePlaybackEndListener();
            });
        } catch {
            setAudioState('idle');
        }
    };

    const onPausePlay = async () => {
        if (!Sound) return;
        try {
            await Sound.pausePlayer();
            Sound.removePlayBackListener();
            setAudioState('paused_playing');
        } catch {
            setAudioState('idle');
        }
    };

    const onResumePlay = async () => {
        if (!Sound) return;
        try {
            await Sound.resumePlayer();
            Sound.addPlayBackListener((e: any) => {
                setPlayTime(Sound.mmss(Math.floor(e.currentPosition)));
            });
            setAudioState('playing');
        } catch {
            setAudioState('idle');
        }
    };

    const onStopPlay = async () => {
        if (!Sound) return;
        try {
            await Sound.stopPlayer();
            Sound.removePlayBackListener();
            Sound.removePlaybackEndListener();
            setAudioState('idle');
            setPlayTime('0:00');
        } catch {
            setAudioState('idle');
        }
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

    if (!Sound) {
        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Audio Recording</Text>
                <Text style={styles.fallbackText}>
                    Audio recording requires react-native-nitro-sound. Run "cd
                    ios && pod install" and rebuild.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Audio Recording</Text>
            <View style={styles.lottieContainer}>
                <LottieView
                    source={getLottieSource()}
                    autoPlay
                    loop
                    style={styles.lottie}
                />
            </View>
            <Text style={styles.timeText}>
                {audioState === 'recording' || audioState === 'paused_recording'
                    ? recordTime
                    : audioState === 'playing' || audioState === 'paused_playing'
                      ? playTime
                      : '0:00'}
            </Text>
            <View style={styles.buttonsRow}>
                {audioState === 'idle' && (
                    <>
                        <TouchableOpacity
                            style={styles.recordBtn}
                            onPress={onStartRecord}
                        >
                            <Text style={styles.btnText}>Record</Text>
                        </TouchableOpacity>
                        {recordedPath && (
                            <TouchableOpacity
                                style={styles.playBtn}
                                onPress={onStartPlay}
                            >
                                <Text style={styles.btnText}>Play</Text>
                            </TouchableOpacity>
                        )}
                    </>
                )}
                {audioState === 'recording' && (
                    <>
                        <TouchableOpacity
                            style={styles.pauseBtn}
                            onPress={onPauseRecord}
                        >
                            <Text style={styles.btnText}>Pause</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.stopBtn}
                            onPress={onStopRecord}
                        >
                            <Text style={styles.btnText}>Stop</Text>
                        </TouchableOpacity>
                    </>
                )}
                {audioState === 'paused_recording' && (
                    <>
                        <TouchableOpacity
                            style={styles.resumeBtn}
                            onPress={onResumeRecord}
                        >
                            <Text style={styles.btnText}>Resume</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.stopBtn}
                            onPress={onStopRecord}
                        >
                            <Text style={styles.btnText}>Stop</Text>
                        </TouchableOpacity>
                    </>
                )}
                {audioState === 'paused_playing' && (
                    <>
                        <TouchableOpacity
                            style={styles.resumeBtn}
                            onPress={onResumePlay}
                        >
                            <Text style={styles.btnText}>Resume</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.stopBtn}
                            onPress={onStopPlay}
                        >
                            <Text style={styles.btnText}>Stop</Text>
                        </TouchableOpacity>
                    </>
                )}
                {audioState === 'playing' && (
                    <>
                        <TouchableOpacity
                            style={styles.pauseBtn}
                            onPress={onPausePlay}
                        >
                            <Text style={styles.btnText}>Pause</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.stopBtn}
                            onPress={onStopPlay}
                        >
                            <Text style={styles.btnText}>Stop</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 16,
    },
    fallbackText: {
        fontSize: 14,
        color: '#64748b',
    },
    lottieContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    lottie: {
        width: 120,
        height: 120,
    },
    timeText: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 16,
        color: '#2563eb',
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
    },
    recordBtn: {
        backgroundColor: '#dc2626',
        padding: 12,
        borderRadius: 8,
        minWidth: 80,
        alignItems: 'center',
    },
    playBtn: {
        backgroundColor: '#16a34a',
        padding: 12,
        borderRadius: 8,
        minWidth: 80,
        alignItems: 'center',
    },
    pauseBtn: {
        backgroundColor: '#f59e0b',
        padding: 12,
        borderRadius: 8,
        minWidth: 80,
        alignItems: 'center',
    },
    resumeBtn: {
        backgroundColor: '#2563eb',
        padding: 12,
        borderRadius: 8,
        minWidth: 80,
        alignItems: 'center',
    },
    stopBtn: {
        backgroundColor: '#64748b',
        padding: 12,
        borderRadius: 8,
        minWidth: 80,
        alignItems: 'center',
    },
    btnText: { color: '#fff', fontWeight: '600' },
});

export default AudioRecorderSection;
