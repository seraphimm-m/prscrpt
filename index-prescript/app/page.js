'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const TASK_POOL = {
  Easy: [
    "Drink exactly three measured sips of water right now.",
    "Open a tab on your screen and type 'The Will of the City' exactly 15 times.",
    "Take a pen and draw a single, small dot on the back of your left hand.",
    "Touch your nose with your left index finger while keeping your right eye closed for 10 seconds.",
    "Point your phone camera out a window, take a photo of the sky, and name it 'Causality.jpg'."
  ],
  Medium: [
    "Balance a spoon or pencil perfectly on your nose or forehead for 10 seconds.",
    "Turn off every single light source in your immediate room for 2 minutes.",
    "Find a book nearby, open it to page 45, and record the first word.",
    "Arrange 5 small objects (coins, keys, pens) on your desk in a perfect straight line.",
    "Sit on the floor cross-legged and stack exactly three empty cans or mugs on top of each other."
  ],
  Hard: [
    "Send the single character 'Ω' to the 3rd person on your direct messages without context.",
    "Place your shoes perfectly upside down right outside your bedroom door frame.",
    "Do 20 jumping jacks completely silently so nobody else hears you.",
    "Tear a piece of paper into the shape of a triangle. Write your first name inside it backwards.",
    "Hold a single piece of ice in your bare palm until it completely melts into water."
  ],
  Insanity: [
    "Stare directly into the glowing blue eye of the Index Logo above for 60 seconds without blinking.",
    "Write down your deepest, darkest secret on a piece of paper, shred it completely, and discard it.",
    "Stand completely frozen like a stone statue for 3 minutes. Do not move a single muscle except to breathe.",
    "Go into a completely pitch-black room, turn your back to the door, and whisper 'Esther' three times.",
    "Do not check any social media, messages, or notifications for the next 30 minutes straight after closing this app."
  ]
};

export default function IndexTerminal() {
  const [task, setTask] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [serial, setSerial] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);
  const [gameState, setGameState] = useState('typing'); // typing, active, success, fail, validating
  const [fallbackMode, setFallbackMode] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const textIndex = useRef(0);

  useEffect(() => {
    // Generate Random Task Core Profiles
    const diffs = Object.keys(TASK_POOL);
    const chosenDiff = diffs[Math.floor(Math.random() * diffs.length)];
    const chosenTask = TASK_POOL[chosenDiff][Math.floor(Math.random() * TASK_POOL[chosenDiff].length)];
    const randomSerial = `PX-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10 + Math.random() * 90)}`;
    
    setDifficulty(chosenDiff);
    setTask(chosenTask);
    setSerial(randomSerial);
    setVerificationCode(`NODE-${Math.floor(1000 + Math.random() * 9000)}-COMPLY`);

    const rawMessage = `============================================================\n                   --- THE INDEX WRIT ---\n SERIAL: ${randomSerial}                                RISK: ${chosenDiff.toUpperCase()}\n============================================================\n\n To the Subject inhabiting this node:\n\n Execute the following directive meticulously. The Weavers have\n patterned this action into the fabric of District 20. Doubt is\n deviation.\n\n DIRECTIVE:\n -----------------------------------------------------------\n "${chosenTask}"\n -----------------------------------------------------------\n\n PROOF REQUIREMENT:\n -> Provide a photographic snapshot of verification. The Weaver's\n    Underground Intelligence Network will parse your validation.\n\n Failure to document actions within the designated temporal window\n will mark your thread for pruning by a Proxy.`;

    // Typewriter effect execution logic
    const interval = setInterval(() => {
      if (textIndex.current < rawMessage.length) {
        setDisplayText((prev) => prev + rawMessage.charAt(textIndex.current));
        textIndex.current++;
      } else {
        setGameState('active');
        clearInterval(interval);
      }
    }, 6);

    return () => clearInterval(interval);
  }, []);

  // Timer Tick Countdowns
  useEffect(() => {
    if (gameState !== 'active' || timeLeft <= 0) {
      if (timeLeft <= 0 && gameState === 'active') setGameState('fail');
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  // Image base64 conversion & upload tracking
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setGameState('validating');

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Data = reader.result.split(',')[1];
      
      try {
        const response = await fetch('/api/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64Data, task, serialNumber: serial, difficulty })
        });
        const data = await response.json();
        
        if (data.success) {
          setDisplayText(`============================================================\n               +++ COGNITIVE RECORD LOCKED +++\n============================================================\n\n Analysis Feedback:\n "${data.feedback}"\n\n Your thread remains unbroken. Standby for future transmissions.`);
          setGameState('success');
        } else {
          setGameState('fail');
        }
      } catch {
        setGameState('fail');
      }
    };
  };

  const handleFallbackSubmit = () => {
    if (textInput.trim() === verificationCode) {
      setDisplayText(`============================================================\n               +++ MANUAL EXCLUSION PROTOCOL +++\n============================================================\n\n Digital fallback accepted. The Weaver logs record your absolute compliance manually.`);
      setGameState('success');
    } else {
      alert("Mismatched signature. The Will of the City cannot be corrupted.");
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <main style={{ backgroundColor: '#070b12', minHeight: '100vh', color: '#e0e6ed', fontFamily: 'Courier, monospace', padding: '20px' }}>
      <div style={{ maxWidth: '650px', margin: '0 auto', textAlign: 'center' }}>
        
        {/* Referencing verbatim file "image_41cc4a.png" per instructions */}
        <div style={{ margin: '20px auto', display: 'block', width: '120px', height: '140px', position: 'relative' }}>
          <Image 
            src="/image_41cc4a.png" 
            alt="The Index Logo" 
            width={120} 
            height={140} 
            style={{ filter: 'drop-shadow(0 0 10px #64b5f6)' }}
            priority
          />
        </div>

        <div style={{ backgroundColor: '#0d1321', border: '1px solid #64b5f6', padding: '20px', borderRadius: '4px', textAlign: 'left', minHeight: '400px', whiteSpace: 'pre-wrap', boxShadow: '0 0 15px rgba(100, 181, 246, 0.15)' }}>
          {gameState === 'validating' ? "============================================================\n[SYSTEM]: TRANSMITTING DATA TO THE WEAVER CORE...\n============================================================" : displayText}
          {gameState === 'fail' && `\n\n============================================================\n               !!! PROXY TERMINATION PROTOCOL !!!\n============================================================\n\n Temporal constraints breached or validation rejected. Your timeline\n has detached from the City's chaotic rhythm.\n\n Proxies Esther, Hubert, and Gloria have collected your execution orders.`}
        </div>

        {gameState === 'active' && (
          <div style={{ marginTop: '20px' }}>
            <div style={{ color: '#ff4d4d', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '15px' }}>
              TIME TO COMPLIANCE: {formatTime(timeLeft)}
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <label style={{ backgroundColor: '#14213d', color: '#64b5f6', padding: '10px 20px', cursor: 'pointer', border: '1px solid #64b5f6', fontWeight: 'bold' }}>
                UPLOAD PHOTO PROOF
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </label>

              <button onClick={() => setFallbackMode(true)} style={{ backgroundColor: '#14213d', color: '#d4af37', padding: '10px 20px', border: '1px solid #d4af37', fontWeight: 'bold', cursor: 'pointer' }}>
                NO CAMERA FALLBACK
              </button>
            </div>
          </div>
        )}

        {fallbackMode && gameState === 'active' && (
          <div style={{ marginTop: '20px', padding: '15px', border: '1px dashed #d4af37', backgroundColor: '#0d1321', textAlign: 'left' }}>
            <p style={{ color: '#d4af37', fontSize: '0.9rem', marginBottom: '10px' }}>Execute the physical task completely. Afterward, input code sequence to confirm compliance: <strong>{verificationCode}</strong></p>
            <input type="text" value={textInput} onChange={(e) => setTextInput(e.target.value)} style={{ width: '70%', padding: '8px', backgroundColor: '#14213d', color: '#fff', border: '1px solid #d4af37', marginRight: '10px' }} />
            <button onClick={handleFallbackSubmit} style={{ padding: '8px 15px', backgroundColor: '#d4af37', color: '#070b12', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>SUBMIT</button>
          </div>
        )}
      </div>
    </main>
  );
}
