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

  // Runs when isPlaying or wpm changes. 
  useEffect(() => {
      if (!isPlaying) return; // If not playing, do nothing
      
      // Increment the current word index evey (60000 / wpm) milliseconds (convert WPM to ms per word)
      const interval = setInterval(() => {
        setCurrentIndex(prev => prev + 1);
      }, 60000 / wpm);
      
      // Clear the interval when the component unmounts or when isPlaying/wpm changes
      return () => clearInterval(interval);
    }, 
    [isPlaying, wpm] // Rerun when either isPlaying or wpm changes
  );

  return (
    <div>
      {/* Display the current word */}
      <p className="text-center text-6xl font-bold text-gray-600 dark:text-gray-300 mb-8">
        {words[currentIndex]}
      </p>
      
      {/* Read Controls */}
      <ReadOptions isPlaying={isPlaying} setIsPlaying={setIsPlaying} wpm={wpm} setWpm={setWpm}/>

      {/* Button to go back to text input */}
      <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors duration-300"
        onClick={() => setIsReading(false)}
      >
        Enter New Text
      </button>
    </div>
  );
}

// Option for controlling playback and speed of the reading.
function ReadOptions({ isPlaying, setIsPlaying, wpm, setWpm }: ReadOptionsProps) {
  return <div className="flex space-x-4 mb-8">
    <button className={`flex-1 py-3 rounded-lg transition-colors duration-300 ${isPlaying ? "bg-red-600 hover:bg-red-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"}`}
      onClick={() => setIsPlaying(!isPlaying)}
    >
      {isPlaying ? "Pause" : "Play"}
    </button>

    <input type="number" className="w-24 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700"
      value={wpm}
      onChange={(e) => setWpm(Number(e.target.value))}
      min={50}
      max={1000}
    />
  </div>
}

