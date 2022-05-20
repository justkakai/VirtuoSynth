import { useContext } from 'react';
import { notes } from '../Notes';
import AppContext from '../contexts/AppContext';
import '../styles/Keyboard.css';

function Keyboard() {

  const { activeKey, playNote } = useContext(AppContext);

  return (
    <section className="keyboard">
      <div className="keys-row">
        {notes.map(({ note, noteOctave, keysClasses }) => (
          <button
            /*style={
              activeKey === noteOctave ?
                keysClasses === "white-key piano-key" ? { backgroundColor: "rgba(174, 3, 253, 0.8)" } : { backgroundColor: "rgb(82, 82, 82)" }
                :
                keysClasses === "white-key piano-key" ? { backgroundColor: "#eee" } : { backgroundColor: "black" }}*/
            className={keysClasses} onClick={() => playNote(noteOctave)}></button>
        ))}
      </div>
      {/* <button onClick={stopSound}>stop sound!</button> */}
    </section>
  )
}

export default Keyboard;