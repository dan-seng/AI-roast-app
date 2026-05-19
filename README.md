# AI Roast Machine

Upload a photo → AI sees it → AI roasts it mercilessly → You can argue back → Repeat.

Built with Next.js, Tailwind CSS, and Gemini AI (gemini-2.5-flash).

## Features

- **Drag-and-drop image upload** - Upload any image by dragging or clicking
- **Multiple roast intensities** - Mild, Medium, Savage, or Poetic
- **Defend yourself** - Type an excuse and the AI will roast you harder
- **Shareable roast cards** - Download and share your roasts as images
- **Roast again** - Get a different angle on the same image

## Tech Stack

- **Frontend**: React + Tailwind CSS (Next.js 16)
- **Backend**: Next.js API Routes
- **AI**: Google Gemini 2.5 Flash (vision model)
- **Image handling**: Base64 encoding (no storage)
- **Share cards**: html2canvas

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Add your Gemini API key to `.env.local`:
```
GEMINI_API_KEY=your_actual_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
app/
 ├── page.tsx              # Main page with all components
 ├── api/
 │    └── roast/
 │         └── route.ts     # API endpoint for roasting
components/
 ├── UploadBox.tsx         # Image upload with drag-and-drop
 ├── RoastCard.tsx         # Display roast with image
 ├── IntensitySlider.tsx   # Roast intensity selector
 ├── DefenseInput.tsx      # User defense text input
 └── ShareButton.tsx       # Share card generation
lib/
 ├── gemini.ts             # Gemini API integration
 └── prompts.ts            # Roast prompts for different intensities
```

## How It Works

1. User uploads an image (converted to base64)
2. User selects roast intensity and optionally adds a defense
3. Frontend sends image + intensity + defense to `/api/roast`
4. Backend calls Gemini 2.5 Flash with the image and appropriate system prompt
5. AI returns a roast based on what it sees in the image
6. Roast is displayed with the image in a shareable card
7. User can download the card as an image or copy it to clipboard

## Roast Intensities

- **Mild**: Gentle and playful observations
- **Medium**: Witty and clever roasts
- **Savage**: Brutally honest Comedy Central-style roasts
- **Poetic**: Beautifully cutting verse

## Deployment

Deploy on Vercel for free:

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com/new)
3. Add `GEMINI_API_KEY` as an environment variable in Vercel settings
4. Deploy

## Viral Strategy Tips

- Target Reddit's r/RoastMe and r/mildlyinteresting
- Post on Twitter/X with hashtag #AIRoastMachine
- Share in Ethiopian tech communities and university groups
- Emphasize the "object roast" angle - upload anything (desk, fridge, car, outfit)
- Make sharing frictionless with the shareable card feature

## License

MIT
