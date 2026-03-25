# 🧟 Patient Zero: The Ultimate AI-Driven Escape Room

Welcome to **Patient Zero**! 🚀 This project was built with a ton of passion (and perhaps a little bit of fear) for the **PromptWars: Virtual Hackathon**.

![Game UI Preview](https://via.placeholder.com/800x400.png?text=Patient+Zero+-+Atmospheric+Escape+Room) 
*(Note to Judges: Live screenshots are attached in the main submission form!)*

---

## 🕰️ A Blast from the Past! (15-20 Years Ago...)

Remember the golden era of early 2000s gaming? Sitting in front of a glowing CRT monitor late at night, clicking through text-based escape rooms or classic point-and-click horror mysteries like *The Room*? Those games were an absolute blast. They forced you to use your imagination, read between the lines, and feel the adrenaline rush of being trapped with nothing but your puzzle-solving wits.

But they had one massive flaw: **Static Storytelling**. Once you figured out the puzzle or saw the jumpscare, the replay value dropped to zero. The game couldn't surprise you twice.

**Patient Zero** fundamentally reimagines this nostalgic classic genre by bringing it into the AI era. 🧠

---

## 🎯 What is the point of the game?

You wake up in absolute darkness. You have no memory of how you got there. 

The point of Patient Zero is survival and escape. But here's the twist: there is no pre-written script. The "Game Master" is a hyper-intelligent, reactive AI that monitors every single decision you make. 

Instead of choosing from predetermined paths, **the game adapts to what YOU fear.** If you hesitate, if you obsess over a locked door, or if you type a completely custom action... the Gemini AI analyzes it, rewrites the environment in real-time, and throws a completely unique horror scenario back at you. **You will never play the same game twice.**

---

## 🛠️ The Badass Tools We Used

To make this vision come alive beautifully (and securely), we heavily utilized modern web tools to build an incredibly robust architecture:

*   **Google Gemini (`@google/genai`)** 🧠: The beating heart of the game. We use Gemini API's `responseMimeType: "application/json"` to force the AI to return perfectly structured data (`narrative`, `choices`, `environment`) instead of just rambling text. This creates a functional, parseable game state engine on the fly!
*   **Next.js 16 (App Router)** ⚡: We built a fully custom, secure backend API route so our Google AI Secret Keys are absolutely never exposed to the client-side JavaScript. It's safe, fast, and highly reliable.
*   **Vanilla CSS** 🎨: No bloated frameworks here! We hand-crafted a zero-dependency stylesheet featuring a customized CRT-flicker animation, pseudo-terminal typography, and dynamic blood-red visual rendering that responds directly to the AI's environmental context!
*   **Docker & Google Cloud Run** ☁️: Packaged as a standalone container to ensure high availability, incredibly fast cold-starts, and flawless deployment directly to the cloud.

---

## 🎮 How to Play

### 🌐 Live Demo
*(Insert your Cloud Run URL here)*

### 💻 Run Locally

Want to test it out right now on your machine? It's ridiculously easy:

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/sarikashirolkar/PromptWars-Virtual.git
    cd PromptWars-Virtual
    ```

2.  **Set Up API Keys**
    Create a `.env.local` file at the root of the project and attach your Gemini API Key safely:
    ```env
    PROMPTWARS_GEMINI_KEY=YOUR_GEMINI_KEY_HERE
    ```

3.  **Install Dependencies & Run**
    ```bash
    npm install
    npm run dev
    ```
    Navigate your browser to `http://localhost:3000` and prepare to be terrified! 👻

---

## 🤝 Contributions
Built solo for the "Build with AI - PromptWars: Virtual" hackathon. The era of static gaming is over. Welcome to the future of dynamic storytelling!
