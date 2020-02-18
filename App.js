import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

import todoStore from './store/todos';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import {Section, Item, RenderIf} from './components';

function App(props) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    async function initFirst() {
      await todoStore.setName('test');
      await todoStore.initialize();
      setIsInitialized(true);
    }
    initFirst();
  }, []);

  useEffect(() => {
    if (isInitialized && todoStore.isInitialized) {
      setData(todoStore.data);
    }
  }, [isInitialized]);

  return (
    <Section>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <Item center backgroundColor={'#FFF'}>
          <View style={styles.body}>
            <Text>todos_test</Text>
          </View>
        </Item>
        <RenderIf
          condition={todoStore.isInitialized && data && data.length > 0}>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            {data && data.map((res, i) => <Text key={i}>{res.text}</Text>)}
          </ScrollView>
        </RenderIf>
        <RenderIf condition={!todoStore.isInitialized && !data}>
          <Item center>
            <ActivityIndicator size="large" color="#0000ff" />
          </Item>
        </RenderIf>
      </SafeAreaView>
    </Section>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
