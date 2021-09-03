import React, {useEffect, useState} from 'react';
import {View, Text, Linking} from 'react-native';

export function useDeepLinkURL() {
  const [linkedURL, setLinkedURL] = useState('');

  // 1. If the app is not already open, it is opened and the url is passed in as the initialURL
  // You can handle these events with Linking.getInitialURL(url) -- it returns a Promise that
  // resolves to the url, if there is one.
  useEffect(() => {
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
      setLinkedURL(decodeURI(initialUrl));
    };

    getUrlAsync();
  }, []);

  // 2. If the app is already open, the app is foregrounded and a Linking event is fired
  // You can handle these events with Linking.addEventListener(url, callback)
  useEffect(() => {
    const callback = ({url}) => setLinkedURL(decodeURI(url));
    Linking.addEventListener('url', callback);
    return () => {
      Linking.removeEventListener('url', callback);
    };
  }, []);

  const resetURL = () => setLinkedURL(null);

  return {linkedURL, resetURL};
}
