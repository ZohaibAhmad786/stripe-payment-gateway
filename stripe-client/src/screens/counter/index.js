import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  selectCount,
} from './../../slices/counterSlice';
import {View, StyleSheet, Button, Text, TextInput} from 'react-native'

export function Counter() {
  const count = useSelector(selectCount);
  const dispatch = useDispatch();
  const [incrementAmount, setIncrementAmount] = useState(2);

  return (
    <View style={{flex:1}}>
      <View styles={styles.row}>
        <Button
          styles={styles.button}
          title="Increment value"
          onPress={() => dispatch(increment())}
        />
        <Text styles={styles.value}>{count}</Text>
        <Button
          styles={styles.button}
          title="Decrement value"
          onPress={() => dispatch(decrement())}
        />
      </View>
      <View styles={styles.row}>
        <TextInput
          styles={styles.textbox}
          placeholder="Set increment amount"
          value={incrementAmount}
          onChangeText={e => setIncrementAmount(e)}
        />
        <Button
          styles={styles.button}
          title="Add Amount"
          onPress={() =>
            dispatch(incrementByAmount(Number(incrementAmount) || 0))
          }
        />
        <Button
          styles={styles.asyncButton}
          title="Add Async"
          onPress={() => dispatch(incrementAsync(Number(incrementAmount) || 0))}
        />
      </View>
    </View>
  );
}

const styles=StyleSheet.create({

})
