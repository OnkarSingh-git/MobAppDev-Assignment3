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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Assignment 3 - API Calls, List Management</Text>

        <Text style={styles.label}>Select Month:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={month}
            onValueChange={(value: string) => setMonth(value)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="-- Select --" value="" />
            {[...'January February March April May June July August September October November December'.split(' ')].map((m, i) => (
              <Picker.Item key={i} label={m} value={(i + 1).toString()} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Enter Day:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="e.g. 7"
          value={day}
          onChangeText={setDay}
        />

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading fact...</Text>
          </View>
        )}

        {error !== '' ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          fact !== '' &&
          !loading && (
            <View style={styles.factContainer}>
              <Text style={styles.factText}>{fact}</Text>
            </View>
          )
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    marginTop: 12,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginTop: 8,
    marginBottom: 16,
    minHeight: 60,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  picker: {
    height: 60,
    width: '100%',
  },
  pickerItem: {
    fontSize: 18,
    height: 60,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
  factContainer: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#f3f3f3',
    borderRadius: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  factText: {
    fontSize: 16,
    lineHeight: 22,
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  errorContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ffcccc',
    borderRadius: 6,
  },
  errorText: {
    color: '#cc0000',
    fontSize: 16,
  },
});

export default App;

