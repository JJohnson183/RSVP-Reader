"use client"; // Render the page client-side

import { useState } from "react"; // Manage variable states (can be thought of making things stateful)

type TextInputViewProps = {
  text: string;
  setText: (value: string) => void;
  setIsReading: (value: boolean) => void;
};

type ReadingViewProps = {
  setIsReading: (value: boolean) => void;
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
            : (<ReadingView setIsReading={setIsReading}/>)
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

function ReadingView({ setIsReading }: ReadingViewProps) {
  return (
    <div>
      {/*=== Show reading mode content when in reading mode ===*/}
      <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors duration-300"
        onClick={() => setIsReading(false)}
      >
        Enter New Text
      </button>
    </div>
  );
}

