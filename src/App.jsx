import React, { useState } from 'react';
import './App.css';

function cleanInputString(str) {
  const regex = /[+-\s]/g;
  return str.replace(regex, '');
}

function isInvalidInput(str) {
  const regex = /\d+e\d+/i;
  return str.match(regex);
}

const App = () => {
  const [entries, setEntries] = useState({ breakfast: [], lunch: [], dinner: [], snacks: [], exercise: [] });
  const [budget, setBudget] = useState('');
  const [output, setOutput] = useState('');
  const [isError, setIsError] = useState(false);

  const addEntry = (type) => {
    setEntries((prevEntries) => {
      const newEntries = { ...prevEntries };
      newEntries[type].push({ name: '', calories: '' });
      return newEntries;
    });
  };

  const handleEntryChange = (type, index, field, value) => {
    setEntries((prevEntries) => {
      const newEntries = { ...prevEntries };
      newEntries[type][index][field] = value;
      return newEntries;
    });
  };

  const getCaloriesFromInputs = (list) => {
    let calories = 0;
    for (const item of list) {
      const currVal = cleanInputString(item.calories);
      const invalidInputMatch = isInvalidInput(currVal);
      if (invalidInputMatch) {
        alert(`Invalid Input: ${invalidInputMatch[0]}`);
        setIsError(true);
        return null;
      }
      calories += Number(currVal);
    }
    return calories;
  };

  const calculateCalories = (e) => {
    e.preventDefault();
    setIsError(false);

    const breakfastCalories = getCaloriesFromInputs(entries.breakfast);
    const lunchCalories = getCaloriesFromInputs(entries.lunch);
    const dinnerCalories = getCaloriesFromInputs(entries.dinner);
    const snacksCalories = getCaloriesFromInputs(entries.snacks);
    const exerciseCalories = getCaloriesFromInputs(entries.exercise);

    if (isError) {
      return;
    }

    const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
    const remainingCalories = budget - consumedCalories + exerciseCalories;
    const surplusOrDeficit = remainingCalories < 0 ? 'Surplus' : 'Deficit';

    setOutput(`
      <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
      <hr>
      <p>${budget} Calories Budgeted</p>
      <p>${consumedCalories} Calories Consumed</p>
      <p>${exerciseCalories} Calories Burned</p>
    `);
  };

  const clearForm = () => {
    setEntries({ breakfast: [], lunch: [], dinner: [], snacks: [], exercise: [] });
    setBudget('');
    setOutput('');
  };

  return (
    <main>
      <h1>Calorie Counter</h1>
      <div className="container">
        <form onSubmit={calculateCalories}>
          <label htmlFor="budget">Budget</label>
          <input
            type="number"
            min="0"
            id="budget"
            placeholder="Daily calorie budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />
          {['breakfast', 'lunch', 'dinner', 'snacks', 'exercise'].map((type) => (
            <fieldset key={type} id={type}>
              <legend>{type.charAt(0).toUpperCase() + type.slice(1)}</legend>
              <div className="input-container">
                {entries[type].map((entry, index) => (
                  <div key={index}>
                    <label htmlFor={`${type}-${index}-name`}>Entry {index + 1} Name</label>
                    <input
                      type="text"
                      id={`${type}-${index}-name`}
                      placeholder="Name"
                      value={entry.name}
                      onChange={(e) => handleEntryChange(type, index, 'name', e.target.value)}
                    />
                    <label htmlFor={`${type}-${index}-calories`}>Entry {index + 1} Calories</label>
                    <input
                      type="number"
                      min="0"
                      id={`${type}-${index}-calories`}
                      placeholder="Calories"
                      value={entry.calories}
                      onChange={(e) => handleEntryChange(type, index, 'calories', e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => addEntry(type)}>Add Entry</button>
            </fieldset>
          ))}
          <div>
            <button type="submit">Calculate Remaining Calories</button>
            <button type="button" onClick={clearForm}>Clear</button>
          </div>
        </form>
        <div id="output" className={`output ${!output && 'hide'}`} dangerouslySetInnerHTML={{ __html: output }}></div>
      </div>
    </main>
  );
};

export default App;
