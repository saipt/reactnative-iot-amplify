import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Button } from 'react-native';

import { Amplify,Hub } from 'aws-amplify';
import {  PubSub } from '@aws-amplify/pubsub';

import amplifyconfig from './amplifyconfiguration.json';
Amplify.configure(amplifyconfig);
import { AWSIoTProvider,CONNECTION_STATE_CHANGE, ConnectionState } from '@aws-amplify/pubsub';

// Apply plugin with new configuration
const pubsub = PubSub.addPluggable(
  new AWSIoTProvider({
    aws_pubsub_region: 'ap-south-1',
    aws_pubsub_endpoint:
      'wss://a2vh905c4kwt1m-ats.iot.ap-south-1.amazonaws.com/mqtt'
  })
);

//const pubsub = new PubSub({
//    region: 'ap-south-1',
//    endpoint:
//      'wss://a2vh905c4kwt1m-ats.iot.ap-south-1.amazonaws.com/mqtt'
//  });

Hub.listen('pubsub', (data: any) => {
  const { payload } = data;
  if (payload.event === CONNECTION_STATE_CHANGE) {
    const connectionState = payload.data.connectionState ;
    console.log(connectionState);
 if (connectionState === "Connected"){
    PubSub.publish({ topics: 'myTopic', message: { msg: 'Message from Amplify console' }}).then(() => console.log("Published! .....")).catch(console.error);

  }
}
});
PubSub.subscribe('myTopic').subscribe({
  next: (data) => console.log('Message received', data),
  error: (error) => console.error(error),
  complete: () => console.log('Done')
});

export default function App() {
const a = async () => {
    await PubSub.publish('myTopic', { msg: 'Hello to all subscribers!' });
    console.log("test ...")
}

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      <Button
        onPress={a}
        title="Learn More"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
    </View>
  );
}

// Remove plugin using the provider name
//PubSub.removePluggable('AWSIoTProvider');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
