import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const App: React.FC = () => {
  const [month, setMonth] = useState<string>('');
  const [day, setDay] = useState<string>('');
  const [fact, setFact] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fetchFact = async (
    selectedMonth: string,
    selectedDay: string
  ): Promise<string> => {
    const url = `https://numbersapi.p.rapidapi.com/${selectedMonth}/${selectedDay}/date?json=true`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'c3b5d67440msh8c44231266b7f32p15e947jsnaa7d24bb51ba',
        'X-RapidAPI-Host': 'numbersapi.p.rapidapi.com',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not OK');
    }

    const data = await response.json();
    return data.text || 'No fact available for this date';
  };

  useEffect(() => {
    if (month !== '' && day !== '') {
      const dayNumber = parseInt(day, 10);
      if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 31) {
        setError('Please enter a valid day (1-31).');
        setFact('');
        return;
      }

      setLoading(true);
      setError('');
      setFact('');

      (async () => {
        try {
          const fetchedFact = await fetchFact(month, day);
          setFact(fetchedFact);
        } catch (error) {
          console.error('Error fetching fact:', error);
          setError('Error fetching fact. Please try again.');
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [month, day]);

