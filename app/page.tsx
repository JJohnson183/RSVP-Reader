"use client"; // Render the page client-side

import { 
  useState,  // Manage variable states (can be thought of making things stateful)
  useEffect  // Handle side effects (like timers for word display)
} from "react"; 

type TextInputViewProps = {
  text: string;
  setText: (value: string) => void;
  setIsReading: (value: boolean) => void;
};

type ReadingViewProps = {
  setIsReading: (value: boolean) => void;
  text: string;
};

type ReadOptionsProps = {
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  wpm: number;
  setWpm: (value: number) => void;
  setCurrentIndex: (value: number) => void;
};

type WordTimerProps = {
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  wpm: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  wordsLength: number;
};


export default function Home() {
  const [text, setText] = useState(""); // Hold user input
  const [isReading, setIsReading] = useState(false); // Track if the user has started reading

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="w-full max-w-4xl p-8">

        {/*=== Determine which view to show: Text input or reading ===*/}
        { !isReading 
            ? (
              <div>
                {/*============ Title and subtitle =============*/}
                <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
                  RSVP Fast Reader
                </h1>
                
                <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
                  This is a reader that implements the Rapid Serial Visual Presentation (RSVP) technique to help you read faster.
                </p>

                {/*============ Text input and start button =============*/}
                <TextInputView text={text} setText={setText} setIsReading={setIsReading}/>
              </div>
            ) 
            : (<ReadingView setIsReading={setIsReading} text={text}/>)
        }
        
      </main>
    </div>
  );
}

//===================================================//
//==================== Views ========================//
function TextInputView({ text, setText, setIsReading }: TextInputViewProps) {
  return (
    <div>
      <textarea className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700"
        placeholder="Enter your text here to start reading..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      >
      </textarea>

      <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        onClick={() => {
          if (text.trim()) {
            setIsReading(true);
          } else {
            alert("Please enter some text to read.");
          }
        }}
      >
        Start Reading
      </button>
    </div>
  )
}

function ReadingView({ setIsReading, text }: ReadingViewProps) {
  const [words, setWords] = useState<string[]>(text.split(" ")); // Split the input text into words
  const [currentIndex, setCurrentIndex] = useState(0); // Index of the current word being displayed
  const [isPlaying, setIsPlaying] = useState(false); // Track if the words are currently playing
  const [wpm, setWpm] = useState(300); // Display speed (words per minute)

  // Get the middle character of the current word
  const getMiddleCharacter = (word: string) => {
    const middle = Math.floor(word.length / 2);
    return {
      before: word.slice(0, middle),
      middle: word[middle],
      after: word.slice(middle + 1)
    };
  };
  const { before, middle, after } = getMiddleCharacter(words[currentIndex]);

  // Increment through each word index according to the WPM. (Runs when isPlaying or wpm changes)
  useWordTimer({isPlaying, setIsPlaying, wpm, setCurrentIndex, wordsLength: words.length});

  return (
    <div>
      {/* Display the current word. Centered on the middle character */}
     <div className="flex justify-center items-center text-6xl font-mono mb-12 h-24">
      <span className="text-right w-96">{before}</span>
      <span className="text-red-500 font-bold">{middle}</span>
      <span className="text-left w-96">{after}</span>
    </div>
      
      {/* Read Controls */}
      <ReadOptions isPlaying={isPlaying} setIsPlaying={setIsPlaying} wpm={wpm} setWpm={setWpm} setCurrentIndex={setCurrentIndex}/>

      {/* Button to go back to text input */}
      <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors duration-300"
        onClick={() => setIsReading(false)}
      >
        Enter New Text
      </button>
    </div>
  );
}
//==================================================//
//====================== Helpers =====================//
// Option for controlling playback and speed of the reading.
function ReadOptions({ isPlaying, setIsPlaying, wpm, setWpm, setCurrentIndex }: ReadOptionsProps) {
  return <div className="flex space-x-4 mb-8 items-center justify-center">
    {/* Control Buttons */}
    <div className="flex gap-2">
      <button className={`w-24 py-3 rounded-lg transition-colors duration-300 ${isPlaying ? "bg-red-600 hover:bg-red-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"}`}
        onClick={() => setIsPlaying(!isPlaying)}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>

      <button className="w-24 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
        onClick={() => {
          setIsPlaying(false);
          setCurrentIndex(0);
        }}
      >
        Restart
      </button>

      {/* TODO: Add reverse button */}
    </div>

    {/* WPM Input */}
    <div className="flex items-center gap-2">
      <label className="text-gray-700 dark:text-gray-300 font-medium">WPM:</label>
      <input type="number" className="w-24 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700"
        value={wpm}
        onChange={(e) => {
          setIsPlaying(false); // Pause when changing speed
          setWpm(Number(e.target.value))
        }}
        min={50}
        max={1000}
      />
    </div>
  </div>
}

// A hook to manage incremeneting through all the words
function useWordTimer({isPlaying, setIsPlaying, wpm, setCurrentIndex, wordsLength}: WordTimerProps) {
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const next = prev + 1;
        if (next >= wordsLength) {
          setIsPlaying(false);
          return wordsLength - 1;
        }
        return next;
      });
    }, 60000 / wpm);
    
    return () => clearInterval(interval);
  }, [isPlaying, wpm]);
}


