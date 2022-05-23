import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';
import { KEY_TO_NOTE } from './Notes';
import AppContext from './contexts/AppContext';
import ReverbContext from './contexts/ReverbContext';
import PingPongContext from './contexts/PingPongContext';
import ChebyshevContext from './contexts/ChebyshevContext';
import CrusherContext from './contexts/CrusherContext';
import InstrumentsContext from './contexts/InstrumentsContext';
import Sliders from './components/Sliders';
import Instruments from './components/Instruments';
import Keyboard from './components/Keyboard';
import './App.css';

function App() {

  const [reverbVal, setReverbVal] = useState("0");
  const [pingPongVal, setPingPongVal] = useState("0.5");
  const [chebyshevVal, setChebyshevVal] = useState("0");
  const [bitCrusherVal, setBitCrusherVal] = useState("8");
  const [instrument, setInstrument] = useState("Synth");
  const [activeKey, setActiveKey] = useState("");
  const [playbackArray, setPlaybackArray] = useState([]);

  function playNote(note) {
    
    Tone.Destination.mute = false;

    const reverb = new Tone.Reverb(parseFloat(reverbVal)).toDestination();

    const pingPongDelay = new Tone.PingPongDelay("8n", parseFloat(pingPongVal)).toDestination();

    const chebyshev = new Tone.Chebyshev(parseInt(chebyshevVal)).toDestination();

    const bitCrusher = new Tone.BitCrusher(parseInt(bitCrusherVal)).toDestination();

    const synth = new Tone[instrument]().toDestination().connect(reverb).connect(pingPongDelay).connect(chebyshev).connect(bitCrusher);

    const now = Tone.now();
    synth.triggerAttackRelease(note, "8n", now); 

  }

  function playLaptopKeys(e) {
    playNote(KEY_TO_NOTE[e.key]);
    setActiveKey(KEY_TO_NOTE[e.key]);
    setTimeout(() => {
      setActiveKey("");
    }, 200)
  }

  useEffect(() => {
    window.addEventListener('keypress', playLaptopKeys);

    return function () {
      window.removeEventListener('keypress', playLaptopKeys);
    }
  });

  useEffect(() => {
    if (activeKey !== "" && activeKey !== undefined) {
      setPlaybackArray(playbackArray => [...playbackArray].concat(activeKey));
    }
  }, [activeKey]);

  function stopSound() {
    Tone.Destination.mute = true;
  }

  function playSoundBack() {
    playbackArray.reduce(async (previousPromise, nextNote) => {
      await previousPromise
      return playNote(nextNote)
    }, Promise.resolve([]));

    console.log(playbackArray);
  }

  /*
    useEffect(() => {
      if (navigator.requestMidiAccess) {
        navigator.requestMidiAccess().then(success, failure);
      } else {
        console.log('requestMidiAccess not found');
      }
    });
  
    function failure() {
      console.log('could not connect to MIDI');
    }
  
    function success(midiAccess) {
      console.log(midiAccess);
    }
    */

  const appValues = { activeKey, setActiveKey, playbackArray, setPlaybackArray, playNote, stopSound, playSoundBack };
  const reverbValues = { reverbVal, setReverbVal }
  const pingPongValues = { pingPongVal, setPingPongVal }
  const chebyshevValues = { chebyshevVal, setChebyshevVal }
  const crusherValues = { bitCrusherVal, setBitCrusherVal }
  const instrumentValues = { instrument, setInstrument }

  return (
    <AppContext.Provider value={appValues}>
      <ReverbContext.Provider value={reverbValues}>
      <PingPongContext.Provider value={pingPongValues}>
        <ChebyshevContext.Provider value={chebyshevValues}>
          <CrusherContext.Provider value={crusherValues}>
            <InstrumentsContext.Provider value={instrumentValues}>
              <main className="App">
                <h1>VirtuoSynth</h1>
                <Sliders />
                <Instruments />
                <Keyboard />
              </main>
            </InstrumentsContext.Provider>
          </CrusherContext.Provider>
        </ChebyshevContext.Provider>
      </PingPongContext.Provider>
      </ReverbContext.Provider>
    </AppContext.Provider>
  );
}

export default App;
