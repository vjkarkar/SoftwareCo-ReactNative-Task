import React from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/store';
import RootNavigator from './src/navigation/RootNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';

function App(): React.JSX.Element {
    return (
        <ErrorBoundary>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Provider store={store}>
                    <SafeAreaProvider>
                        <StatusBar
                            barStyle="dark-content"
                            backgroundColor="#f8fafc"
                        />
                        <RootNavigator />
                    </SafeAreaProvider>
                </Provider>
            </GestureHandlerRootView>
        </ErrorBoundary>
    );
}

export default App;
